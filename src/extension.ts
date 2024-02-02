import * as vscode from "vscode";
import { YamlDefinitionProvider } from "./yaml-definition-provider";
import { Cache } from "./utils/cache";
import { Logger } from "./utils/logger";
import { isDebug } from "./constants";

export function activate(context: vscode.ExtensionContext) {
  const logger = new Logger(isDebug ? console : undefined);

  const cacheTime = 5000 * 1;
  const cache = new Cache<vscode.Location[]>(cacheTime);

  context.subscriptions.push(
    vscode.languages.registerDefinitionProvider(
      "yaml",
      new YamlDefinitionProvider(cache, logger)
    )
  );
}
