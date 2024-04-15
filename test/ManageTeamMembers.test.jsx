import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import { ManageTeamMembers } from "../src/components/Modal/ManageTeamMembers";

const mockSetManageTeamMemberModalOpen = jest.fn();
const mockCurrentTeam = {
  _id: "team_id",
  members: [
    {
      _id: "member1_id",
      user: {
        iconpath: "path/to/icon1",
        nickname: "User1",
      },
      role: "팀원",
    },
    {
      _id: "member2_id",
      user: {
        iconpath: "path/to/icon2",
        nickname: "User2",
      },
      role: "팀원",
    },
  ],
};
const mockCurrentUserRole = "팀장";

describe("ManageTeamMembers", () => {
  it("renders properly with members and buttons", async () => {
    render(
      <ManageTeamMembers
        setManageTeamMemberModalOpen={mockSetManageTeamMemberModalOpen}
        currentTeam={mockCurrentTeam}
        currentUserRole={mockCurrentUserRole}
      />,
    );

    expect(screen.getAllByText("User1")).toBeTruthy();
    expect(screen.getAllByText("User2")).toBeTruthy();

    fireEvent.click(screen.getAllByText("User1")[0]);

    await waitFor(() => {
      expect(screen.getAllByText("팀장")).toBeTruthy();
      expect(screen.getAllByText("팀원")).toBeTruthy();
      expect(screen.getAllByText("수습")).toBeTruthy();
    });
  });

  it("closes the modal when close button is clicked", () => {
    render(
      <ManageTeamMembers
        setManageTeamMemberModalOpen={mockSetManageTeamMemberModalOpen}
        currentTeam={mockCurrentTeam}
        currentUserRole={mockCurrentUserRole}
      />,
    );

    fireEvent.click(screen.getByText("닫기"));

    expect(mockSetManageTeamMemberModalOpen).toHaveBeenCalledWith(false);
  });
});
