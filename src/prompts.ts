import * as vscode from 'vscode';
import { getComponentFolders } from './utils/pathUtils';
import * as path from 'path';

export async function promptUserForComponentDetails(
	componentsPath: string,
	isUsingTypeScript: boolean
) {
	const isNestedComponent = await vscode.window.showQuickPick(['No', 'Yes'], {
		placeHolder: 'Should this component be part of another component?',
	});

	let targetPath = componentsPath;

	if (isNestedComponent === 'Yes') {
		const folders = await getComponentFolders(componentsPath);
		const selectedFolder = await vscode.window.showQuickPick(folders, {
			placeHolder: 'Select the component folder to add the new component',
		});

		if (selectedFolder) {
			targetPath = path.join(componentsPath, selectedFolder.label);
		}
	}

	const isContainerPresentation = await vscode.window.showQuickPick(['No', 'Yes'], {
		placeHolder: 'Should the component be Container-Presentation?',
	});

	let useTypescript = false;
	let usePropTypes = false;

	if (isUsingTypeScript) {
		useTypescript = true;
	} else {
		const userChoice = await vscode.window.showQuickPick(['TypeScript', 'PropTypes'], {
			placeHolder: 'Do you want to use TypeScript or PropTypes?',
		});

		if (userChoice === 'TypeScript') {
			useTypescript = true;
		} else if (userChoice === 'PropTypes') {
			usePropTypes = true;
		}
	}

	return {
		targetPath,
		isContainerPresentation: isContainerPresentation === 'Yes',
		useTypescript,
		usePropTypes,
	};
}
