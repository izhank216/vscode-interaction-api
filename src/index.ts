// @izhank216/vscode-interaction-api
// Unofficial interaction API for VSCode

import * as vscode from "vscode";
import { getExtensionLogger } from "@vscode-logging/logger";
import { LanguageClient, LanguageClientOptions, ServerOptions } from "vscode-languageclient/node";
import { CAPIClient, RequestType } from "@vscode/copilot-api";
import wrappy = require("wrappy");

/**
 * Logger Helper
 */
export let LoggerHelper: ReturnType<typeof getExtensionLogger> | null = null;

export function setupLogger(context: vscode.ExtensionContext) {
    LoggerHelper = getExtensionLogger({
        extName: "vscode-interaction-api",
        level: "info",
        logPath: context.logPath,
        logOutputChannel: vscode.window.createOutputChannel("VSCode Interaction API"),
        sourceLocationTracking: false,
        logConsole: true,
    });
}

/**
 * Webview Helper
 * Stores created panels for runtime management
 */
export const WebviewHelper = {
    panels: new Map<string, vscode.WebviewPanel>(),

    createPanel: (
        viewType: string,
        title: string,
        showOptions: vscode.ViewColumn,
        options?: vscode.WebviewPanelOptions & vscode.WebviewOptions
    ) => {
        const panel = vscode.window.createWebviewPanel(viewType, title, showOptions, options);
        WebviewHelper.panels.set(viewType, panel);
        LoggerHelper?.info(`Webview panel created and stored: ${viewType} - ${title}`);

        // Automatically dispose when closed
        panel.onDidDispose(() => {
            WebviewHelper.panels.delete(viewType);
            LoggerHelper?.info(`Webview panel disposed: ${viewType}`);
        });

        return panel;
    },

    getPanel: (viewType: string) => {
        return WebviewHelper.panels.get(viewType);
    }
};

/**
 * Notebook Helper
 * Stores registered notebook renderers for runtime use
 */
export const NotebookHelper = {
    renderers: new Map<string, any>(),

    registerRenderer: (rendererId: string, renderer: any) => {
        if (NotebookHelper.renderers.has(rendererId)) {
            LoggerHelper?.warn(`Renderer ${rendererId} already registered`);
            return;
        }

        NotebookHelper.renderers.set(rendererId, renderer);
        LoggerHelper?.info(`Notebook renderer registered: ${rendererId}`);
    },

    getRenderer: (rendererId: string) => {
        return NotebookHelper.renderers.get(rendererId);
    }
};

/**
 * Copilot Helper
 */
export const CopilotHelper = {
    requestCompletion: async (
        editorDetails: any,
        license: string,
        fetchOptions: any
    ) => {
        if (!editorDetails || !license) {
            throw new Error("editorDetails and license are required for Copilot requests.");
        }

        const client = new CAPIClient(editorDetails, license);

        const handleResponse = wrappy((response: any) => {
            LoggerHelper?.info("Copilot request completed successfully");
            return response;
        });

        const handleError = wrappy((err: any) => {
            LoggerHelper?.error("Copilot request failed", err);
            throw err;
        });

        try {
            const response = await client.makeRequest(fetchOptions, { type: RequestType.ChatCompletions });
            return handleResponse(response);
        } catch (err) {
            return handleError(err);
        }
    }
};

/**
 * Language Client Helper
 */
export const LanguageClientHelper = {
    createClient: (name: string, serverOptions: ServerOptions, clientOptions: LanguageClientOptions) => {
        LoggerHelper?.info(`Language client created: ${name}`);
        return new LanguageClient(name, serverOptions, clientOptions);
    }
};

/**
 * Package version
 */
export const version = "1.0.0";
