import React from "react";
import { render, screen } from "@testing-library/react";
import DropZone from "../src/components/DropZone";

describe("DropZone", () => {
  it("displays instruction text when no files are dropped", () => {
    render(<DropZone />);

    expect(screen.getByText("클릭 혹은 파일을 이곳에 드롭하세요")).toBeTruthy();
  });
});
