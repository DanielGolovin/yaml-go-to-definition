import * as path from "path";
import { getFilesContentMap } from "../get-files-content-map";

describe("getFilesContentMap", () => {
  it("should return a map of file paths to file content", () => {
    const root = path.resolve(__dirname, "data");

    const result = getFilesContentMap(root);

    const expected = {
      [path.join(__dirname, "/data/d/d.yaml")]: [".d: d"],
      [path.join(__dirname, "/data/c.yaml")]: [".c: c"],
      [path.join(__dirname, "/data/b.yml")]: [".b: b\r", ""],
      [path.join(__dirname, "/data/a.yaml")]: [
        ".a:\r",
        "  extends: .b\r",
        "  value: !reference [.c]\r",
        "",
      ],
    };

    expect(result).toEqual(expected);
  });
});
