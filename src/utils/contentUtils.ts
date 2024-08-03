import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { promptUserForComponentDetails } from '../prompts';
import {
	createFunctionalComponentContent,
	createContainerComponentContent,
	createPresentationComponentContent,
	createTypesContent,
} from './contentUtils';
import { getComponentFolders } from './pathUtils';

export async function createComponent() {
	const componentName = await vscode.window.showInputBox({
		prompt: 'Enter the component name',
		placeHolder: 'e.g., MyComponent',
	});

	if (!componentName) {
		vscode.window.showErrorMessage('Component name is required');
		return;
	}

	const workspaceFolders = vscode.workspace.workspaceFolders;
	if (!workspaceFolders) {
		vscode.window.showErrorMessage('No workspace folder found');
		return;
	}

	const workspacePath = workspaceFolders[0].uri.fsPath;
	const componentsPath = path.join(workspacePath, 'components');

	if (!fs.existsSync(componentsPath)) {
		fs.mkdirSync(componentsPath);
	}

	const isUsingTypeScript = checkForTypeScript(workspacePath);

	const { targetPath, isContainerPresentation, useTypescript, usePropTypes } =
		await promptUserForComponentDetails(componentsPath, isUsingTypeScript);

	const componentDir = path.join(targetPath, componentName.toLowerCase());
	const componentFile = path.join(
		componentDir,
		`${componentName}${useTypescript ? '.tsx' : '.jsx'}`
	);
	const presentationFile = path.join(
		componentDir,
		`${componentName}Presentation${useTypescript ? '.tsx' : '.jsx'}`
	);
	const typesFile = path.join(componentDir, `${componentName}.types.ts`);

	if (fs.existsSync(componentDir)) {
		vscode.window.showErrorMessage('A folder with this name already exists');
		return;
	}

	fs.mkdirSync(componentDir);

	if (isContainerPresentation) {
		fs.writeFileSync(
			componentFile,
			createContainerComponentContent(componentName, useTypescript, usePropTypes)
		);
		fs.writeFileSync(
			presentationFile,
			createPresentationComponentContent(componentName, useTypescript, usePropTypes)
		);
		if (useTypescript) {
			fs.writeFileSync(typesFile, createTypesContent(componentName));
		}
	} else {
		fs.writeFileSync(componentFile, createFunctionalComponentContent(componentName, usePropTypes));
	}

	vscode.window.showInformationMessage(`Component ${componentName} has been created!`);
}

function checkForTypeScript(workspacePath: string): boolean {
	try {
		const packageJsonPath = path.join(workspacePath, 'package.json');
		if (!fs.existsSync(packageJsonPath)) {
			return false;
		}

		const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
		const dependencies = packageJson.dependencies || {};
		const devDependencies = packageJson.devDependencies || {};

		return 'typescript' in dependencies || 'typescript' in devDependencies;
	} catch (error) {
		vscode.window.showErrorMessage('Could not read package.json file.');
		return false;
	}
}
