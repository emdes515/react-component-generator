import * as vscode from 'vscode';
import { createComponent } from './utils/componentUtils';

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand(
		'react-component-generator.createComponent',
		async () => {
			try {
				await createComponent();
			} catch (error) {
				vscode.window.showErrorMessage('An error occurred while creating the component.');
				console.error(error);
			}
		}
	);

	context.subscriptions.push(disposable);
}

export function deactivate() {}
