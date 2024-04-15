import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { CreateTeam } from "../src/components/Modal/CreateTeam";

jest.mock("axios");

describe("CreateTeam component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("validates team name length and special characters", async () => {
    render(
      <BrowserRouter>
        <CreateTeam />
      </BrowserRouter>,
    );

    const input = screen.getByRole("textbox");
    const button = screen.getByRole("button", { name: /생성하기/i });

    fireEvent.change(input, { target: { value: "aa" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/팀 이름은 3자 이상, 10자 이하/)).toBeTruthy();
    });

    fireEvent.change(input, { target: { value: "!@#" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/특수문자를 포함할 수 없습니다/)).toBeTruthy();
    });
  });
});
