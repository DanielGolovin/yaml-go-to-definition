import { workspace } from "vscode";

export function getWorkspaceRoot() {
  const root = workspace.workspaceFolders![0].uri.fsPath;
  return root;
}
