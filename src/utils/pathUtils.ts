import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

export async function getComponentFolders(basePath: string): Promise<vscode.QuickPickItem[]> {
	const folders: vscode.QuickPickItem[] = [];

	function traverseDirectory(currentPath: string) {
		const items = fs.readdirSync(currentPath);

		for (const item of items) {
			const itemPath = path.join(currentPath, item);
			if (fs.statSync(itemPath).isDirectory()) {
				folders.push({ label: path.relative(basePath, itemPath) });
				traverseDirectory(itemPath);
			}
		}
	}

	traverseDirectory(basePath);

	return folders;
}
