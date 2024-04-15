import React from "react";
import { render } from "@testing-library/react";
import { DeleteRestoreFileFolder } from "../src/components/Modal/DeleteRestoreFileFolder";

describe("DeleteRestoreFileFolder component", () => {
  it("renders restore, delete, and cancel buttons", () => {
    const setDeleteRestoreFileFolderModalOpen = jest.fn();
    const setTrashBin = jest.fn();
    const currentUserRole = "팀장";
    const selectedElementId = "file123";
    const selectedType = "file";

    const { getByText } = render(
      <DeleteRestoreFileFolder
        setDeleteRestoreFileFolderModalOpen={
          setDeleteRestoreFileFolderModalOpen
        }
        selectedElementId={selectedElementId}
        selectedType={selectedType}
        setTrashBin={setTrashBin}
        currentUserRole={currentUserRole}
      />,
    );

    const restoreButton = getByText("복구하기");
    const deleteButton = getByText("삭제하기");
    const cancelButton = getByText("취소하기");

    expect(restoreButton).toBeTruthy();
    expect(deleteButton).toBeTruthy();
    expect(cancelButton).toBeTruthy();
  });
});
