import { FilesContentMap } from "../get-files-content-map";
import { getFilesFoundInLinesMap } from "../get-files-found-in-lines-map";

describe("getFilesFoundInLinesMap", () => {
  const fileContentRecord: FilesContentMap = {
    "/data/d/d.yaml": [".d: d"],
    "/data/c.yaml": [".c: c"],
    "/data/b.yml": [".b: b\r", ""],
    "/data/a.yaml": [
      ".a:\r",
      "  extends: .b\r",
      "  value: !reference [.c]\r",
      "",
    ],
  };

  it("should find basic lines", () => {
    const searchText = ".b";

    const result = getFilesFoundInLinesMap(fileContentRecord, searchText);

    const expected = {
      "/data/b.yml": [1],
    };

    expect(result).toEqual(expected);
  });

  it("should find references", () => {
    const searchText = ".c";

    const result = getFilesFoundInLinesMap(fileContentRecord, searchText);

    const expected = {
      "/data/c.yaml": [1],
    };

    expect(result).toEqual(expected);
  });
});
