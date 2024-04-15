import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import { PermissionSetting } from "../src/components/Modal/PermissionSetting";

const mockSetPermissionModalOpen = jest.fn();
const mockSelectedElementId = "selected_element_id";
const mockSelectedType = "folder";
const mockCurrentUserRole = "팀장";
const mockClickPosition = { x: 100, y: 200 };

jest.mock("axios", () => ({
  patch: jest.fn(() =>
    Promise.resolve({ status: 201, data: { message: "Success", user: {} } }),
  ),
}));

describe("PermissionSetting", () => {
  it("renders properly with buttons", async () => {
    render(
      <PermissionSetting
        setPermissionModalOpen={mockSetPermissionModalOpen}
        selectedElementId={mockSelectedElementId}
        selectedType={mockSelectedType}
        currentUserRole={mockCurrentUserRole}
        clickPosition={mockClickPosition}
      />,
    );

    expect(screen.getByText("팀장")).toBeTruthy();
    expect(screen.getByText("팀원")).toBeTruthy();
    expect(screen.getByText("수습")).toBeTruthy();
    expect(screen.getByText("취소")).toBeTruthy();
  });

  it("calls handlePermissionSettingButton and closes modal on button click", async () => {
    render(
      <PermissionSetting
        setPermissionModalOpen={mockSetPermissionModalOpen}
        selectedElementId={mockSelectedElementId}
        selectedType={mockSelectedType}
        currentUserRole={mockCurrentUserRole}
        clickPosition={mockClickPosition}
      />,
    );

    fireEvent.click(screen.getByText("취소"));

    await waitFor(() => {
      expect(mockSetPermissionModalOpen).toHaveBeenCalledWith(false);
    });
  });
});
