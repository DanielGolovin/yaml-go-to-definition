import * as vscode from "vscode";
import { getFilesContentMap } from "./core/get-files-content-map";
import { getWorkspaceRoot } from "./utils/get-workspace-root";

import { Cache } from "./utils/cache";
import { ILogger } from "./utils/logger";
import {
  getFilesFoundInLinesMap,
  FilesFoundInLinesMap,
} from "./core/get-files-found-in-lines-map";

export class YamlDefinitionProvider implements vscode.DefinitionProvider {
  constructor(
    private cache?: Cache<vscode.Location[]>,
    private logger?: ILogger
  ) {}

  provideDefinition(
    document: vscode.TextDocument,
    position: vscode.Position
  ): vscode.Location[] {
    this.logger?.log(document);
    this.logger?.log(position);
    this.logger?.startPerformanceLog("Total time: provideDefinition");

    const name = this.getClicked(document, position);
    this.logger?.log("Looking for defenition of: ", name);

    const cacheKey = `${vscode.workspace.name}-${name}`;
    this.logger?.log("cacheKey", cacheKey);
    const cachedResult = this.cache?.get(cacheKey);

    if (cachedResult) {
      this.logger?.log("Returning cached result");
      this.logger?.endPerformanceLog("Total time: provideDefinition");

      return cachedResult;
    }

    const root = getWorkspaceRoot();

    this.logger?.startPerformanceLog("Total time: getFilePathToLineNumbersMap");
    const filePathToLineNumbersMap = getFilesFoundInLinesMap(
      getFilesContentMap(root),
      name
    );
    this.logger?.endPerformanceLog("Total time: getFilePathToLineNumbersMap");

    const locations = this.getLocations(filePathToLineNumbersMap);
    this.cache?.set(cacheKey, locations);

    this.logger?.endPerformanceLog("Total time: provideDefinition");

    return locations;
  }

  private createLocationFromFilePathAndLineNumber(
    filePath: AbsoluteFilePath,
    lineNumber: LineNumber
  ): vscode.Location {
    const uri = vscode.Uri.file(filePath);
    const pos = new vscode.Position(lineNumber - 1, 0);
    return new vscode.Location(uri, pos);
  }

  private createLocationsFromFilePath(
    filePath: AbsoluteFilePath,
    lineNumbers: LineNumber[]
  ): vscode.Location[] {
    return lineNumbers.map((lineNumber) =>
      this.createLocationFromFilePathAndLineNumber(filePath, lineNumber)
    );
  }

  private getLocations(
    filePathToLineNumbersMap: FilesFoundInLinesMap
  ) {
    return Object.entries(filePathToLineNumbersMap).flatMap(
      ([filePath, lineNumbers]) =>
        this.createLocationsFromFilePath(filePath, lineNumbers)
    );
  }

  private getClicked(document: vscode.TextDocument, position: vscode.Position) {
    const range = document.getWordRangeAtPosition(position, /[^ \{\}\[\]\,]+/);
    const name = document.getText(range);

    return name;
  }
}
