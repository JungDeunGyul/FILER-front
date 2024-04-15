import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { FolderAccess } from "../src/components/Modal/FolderAccess";

describe("FolderAccess component", () => {
  it("displays error message and closes modal when '닫기' button is clicked", () => {
    const setFolderAccessModalOpen = jest.fn();

    const { getByText } = render(
      <FolderAccess setFolderAccessModalOpen={setFolderAccessModalOpen} />,
    );

    expect(getByText(/해당 폴더에 접근이 불가능합니다/i)).toBeTruthy();

    fireEvent.click(getByText(/닫기/i));

    expect(setFolderAccessModalOpen).toHaveBeenCalledWith(false);
  });
});
