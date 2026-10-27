import * as vscode from 'vscode';
import * as path from 'path';

// 存储选中的比较文件 URI
let compareUri: vscode.Uri | undefined;

// 选择文件进行比较
export async function selectForCompare(resourceUri: vscode.Uri | undefined): Promise<void> {
    if (!resourceUri) {
        vscode.window.showErrorMessage(
            vscode.l10n.t('Please right-click a file in the file tree to use this feature')
        );
        return;
    }
    compareUri = resourceUri;
    vscode.window.showInformationMessage(
        vscode.l10n.t('Selected file for comparison: {fileName}', {
            fileName: path.basename(compareUri.fsPath)
        })
    );
}

// 与已选文件比较
export async function compareWithSelected(resourceUri: vscode.Uri | undefined): Promise<void> {
    if (!resourceUri) {
        vscode.window.showErrorMessage(
            vscode.l10n.t('Please right-click a file in the file tree to use this feature')
        );
        return;
    }
    if (!compareUri) {
        vscode.window.showErrorMessage(vscode.l10n.t('Please select a comparison file first'));
        return;
    }

    try {
        const leftUri = compareUri;
        const rightUri = resourceUri;
        const leftName = path.basename(leftUri.fsPath);
        const rightName = path.basename(rightUri.fsPath);
        const title = `${leftName} vs ${rightName}`;

        // 使用 VS Code 内置差异编辑器
        await vscode.commands.executeCommand('vscode.diff', leftUri, rightUri, title);
    } catch (error) {
        vscode.window.showErrorMessage(
            vscode.l10n.t('File comparison failed: {error}', { error: String(error) })
        );
    }
}

// 获取当前选中的比较文件（供其他插件使用）
export function getCompareUri(): vscode.Uri | undefined {
    return compareUri;
}

// 清除选中的比较文件
export function clearCompareUri(): void {
    compareUri = undefined;
}
