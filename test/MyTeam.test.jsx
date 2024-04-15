import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import MyTeam from "../src/components/MyTeam";
import useUserStore from "../src/components/store/userData";

jest.mock("../src/components/store/userData");

describe("MyTeam component", () => {
  it("renders team names correctly", () => {
    const userData = {
      teams: [
        { _id: "1", name: "Team 1" },
        { _id: "2", name: "Team 2" },
      ],
    };
    useUserStore.mockReturnValue({ userData });

    render(
      <BrowserRouter>
        <MyTeam />
      </BrowserRouter>,
    );

    expect(screen.getByText("Team 1")).toBeTruthy();
    expect(screen.getByText("Team 2")).toBeTruthy();
  });

  it("navigates to team detail page when team is clicked", () => {
    const userData = {
      teams: [{ _id: "1", name: "Team 1" }],
    };
    useUserStore.mockReturnValue({ userData });

    const mockNavigate = jest.fn();
    jest.mock("react-router-dom", () => ({
      ...jest.requireActual("react-router-dom"),
      useNavigate: () => mockNavigate,
    }));

    render(
      <BrowserRouter>
        <MyTeam />
      </BrowserRouter>,
    );

    fireEvent.click(screen.getByText("Team 1"));

    expect(window.location.pathname).toBe("/team/1");
  });

  it("filters teams by name", () => {
    const userData = {
      teams: [
        { _id: "1", name: "Team 1" },
        { _id: "2", name: "Team 2" },
      ],
    };
    useUserStore.mockReturnValue({ userData });

    render(
      <BrowserRouter>
        <MyTeam />
      </BrowserRouter>,
    );

    fireEvent.change(screen.getByPlaceholderText("팀 이름을 입력하세요"), {
      target: { value: "2" },
    });

    expect(screen.getByText("Team 2")).toBeTruthy();
  });
});
