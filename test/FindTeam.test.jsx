import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { FindTeam } from "../src/components/Modal/FindTeam";

jest.mock("axios");

describe("FindTeam component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("displays error message for invalid team name", async () => {
    const setFindTeamModalOpen = jest.fn();
    const mockInvalidTeamName = "te@stTeam";

    const { getByText, getByRole } = render(
      <FindTeam setFindTeamModalOpen={setFindTeamModalOpen} />,
    );

    const teamNameInput = getByRole("textbox");
    fireEvent.change(teamNameInput, { target: { value: mockInvalidTeamName } });

    const submitButton = getByText(/신청하기/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        getByText(
          /팀 이름은 3자 이상, 10자 이하이며 특수문자를 포함할 수 없습니다./i,
        ),
      ).toBeTruthy();
    });
  });
});
