# vscode-interaction-api

Unofficial interaction API for VSCode.

---

## Installation

Install via npm:

```bash
npm install @izhank216/vscode-interaction-api

Or with Yarn:
```bash
yarn add @izhank216/vscode-interaction-api

## Usage
import * as vscode from "vscode";
import {
    setupLogger,
    LoggerHelper,
    WebviewHelper,
    CopilotHelper,
    LanguageClientHelper,
    version
} from "@izhank216/vscode-interaction-api";

export function activate(context: vscode.ExtensionContext) {
    // Setup logger
    setupLogger(context);

    LoggerHelper?.info(`VSCode Interaction API v${version} activated`);

    // Example: Create a webview
    const panel = WebviewHelper.createPanel(
        "exampleView",
        "Example Panel",
        vscode.ViewColumn.One
    );

    // Example: Copilot request
    /*
    const response = await CopilotHelper.requestCompletion(
        editorDetails,
        copilotLicense,
        fetchOptions
    );
    console.log(response);
    */

    // Example: Language client
    /*
    const client = LanguageClientHelper.createClient(
        "exampleClient",
        serverOptions,
        clientOptions
    );
    client.start();
    */
}`

