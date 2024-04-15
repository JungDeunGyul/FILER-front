import React from "react";
import { render, screen } from "@testing-library/react";
import UpdateFileDropZone from "../src/components/UpdateFileDropZone";

describe("UpdateFileDropZone Component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders without crashing", () => {
    render(<UpdateFileDropZone />);
    expect(screen.getByText("업데이트 할 파일을 넣어주세요")).toBeTruthy();
  });
});
