import * as glob from "glob";
import * as path from "path";
import * as fs from "fs";

export type FilesContentMap = Record<AbsoluteFilePath, FileContentLine[]>;

export function getFilesContentMap(root: string): FilesContentMap {
  const files: RelativeFilePath[] = getYamlFilePaths(root);

  const fileContentMap = files.reduce<FilesContentMap>(
    (accumulator, filePath) => {
      const absoluteFilePath = path.resolve(root, filePath);
      const lines = readFileAndSplitLines(absoluteFilePath);
      accumulator[absoluteFilePath] = lines;
      return accumulator;
    },
    {}
  );

  return fileContentMap;
}

function readFileAndSplitLines(filePath: AbsoluteFilePath): FileContentLine[] {
  const content = fs.readFileSync(filePath, { encoding: "utf8" });
  return content.split("\n");
}

function getYamlFilePaths(root: string): RelativeFilePath[] {
  return glob.sync("**/*.y?(a)ml", {
    cwd: root,
    ignore: "**/node_modules/**",
    dot: true,
  });
}
