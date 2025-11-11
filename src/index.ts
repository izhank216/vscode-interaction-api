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
        logConsole: true
    });
}

/**
 * Webview helper
 */
export const WebviewHelper = {
    createPanel: (
        viewType: string,
        title: string,
        showOptions: vscode.ViewColumn,
        options?: vscode.WebviewPanelOptions & vscode.WebviewOptions
    ) => {
        const panel = vscode.window.createWebviewPanel(viewType, title, showOptions, options);
        LoggerHelper?.info(`Webview panel created: ${viewType} - ${title}`);
        return panel;
    }
};

/**
 * Notebook helper
 */
export const NotebookHelper = {
    registerRenderer: (rendererId: string, renderer: any) => {
        LoggerHelper?.info(`Notebook renderer registered: ${rendererId}`);
        // runtime registration logic goes here
    }
};

/**
 * Copilot helper
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

        // Safe single-run response handler
        const handleResponse = wrappy((response: any) => {
            LoggerHelper?.info("Copilot request completed successfully");
            return response;
        });

        // Safe single-run error handler
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
 * Language Client helper
 */
export const LanguageClientHelper = {
    createClient: (name: string, serverOptions: ServerOptions, clientOptions: LanguageClientOptions) => {
        LoggerHelper?.info(`Language client created: ${name}`);
        const client = new LanguageClient(name, serverOptions, clientOptions);
        return client;
    }
};

/**
 * Package version
 */
export const version = "1.0.0";
