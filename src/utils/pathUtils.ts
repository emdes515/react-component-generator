import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

export async function getComponentFolders(basePath: string) {
	const folders: vscode.QuickPickItem[] = [];

	function readDirRecursive(dir: string, parentFolder: string = '') {
		const items = fs.readdirSync(dir);
		items.forEach((item) => {
			const fullPath = path.join(dir, item);
			if (fs.statSync(fullPath).isDirectory()) {
				const folderPath = parentFolder ? `${parentFolder}/${item}` : item;
				folders.push({ label: folderPath });
				readDirRecursive(fullPath, folderPath);
			}
		});
	}

	readDirRecursive(basePath);
	return folders;
}

export function createNestedFolders(dirPath: string) {
	if (!fs.existsSync(dirPath)) {
		fs.mkdirSync(dirPath, { recursive: true });
	}
}
