import * as vscode from 'vscode';
import { getComponentFolders } from './utils/pathUtils';

export async function promptUserForComponentDetails(componentsPath: string) {
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

	const useTypescript = await vscode.window.showQuickPick(['No', 'Yes'], {
		placeHolder: 'Use TypeScript?',
	});

	const usePropTypes = await vscode.window.showQuickPick(['No', 'Yes'], {
		placeHolder: 'Use PropTypes?',
	});

	return {
		targetPath,
		isContainerPresentation: isContainerPresentation === 'Yes',
		useTypescript: useTypescript === 'Yes',
		usePropTypes: usePropTypes === 'Yes',
	};
}
