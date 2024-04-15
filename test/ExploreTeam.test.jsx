import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import ExploreTeam from "../src/components/ExploreTeam";

describe("ExploreTeam Component", () => {
  it('opens create team modal when "팀 생성하기" button is clicked', () => {
    render(
      <Router>
        <ExploreTeam />
      </Router>,
    );

    fireEvent.click(screen.getByText("팀 생성하기"));

    expect(screen.getByText("생성하기")).toBeTruthy();
  });

  it('opens find team modal when "팀 찾기" button is clicked', () => {
    render(
      <Router>
        <ExploreTeam />
      </Router>,
    );

    fireEvent.click(screen.getByText("팀 찾기"));

    expect(screen.getByText("찾는 팀 이름을 입력해주세요")).toBeTruthy();
  });

  it('redirects to "/myteam" page when "팀 페이지로 이동" button is clicked', () => {
    render(
      <Router>
        <ExploreTeam />
      </Router>,
    );

    fireEvent.click(screen.getByText("팀 페이지로 이동"));

    expect(window.location.pathname).toBe("/myteam");
  });
});
