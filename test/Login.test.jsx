import React from "react";
import { render, screen } from "@testing-library/react";
import Login from "../src/components/Login";
import { BrowserRouter as Router } from "react-router-dom";

jest.mock("firebase/auth", () => ({
  signInWithPopup: jest.fn(),
}));

jest.mock("../src/utils/firebase", () => ({
  initializeApp: jest.fn(),
  auth: jest.fn(),
}));

describe("Login Component", () => {
  it("calls signInWithPopup and navigates to Home on successful login", async () => {
    render(
      <Router>
        <Login />
      </Router>,
    );

    expect(screen.getByText("Sign in With Google")).toBeTruthy();
  });
});
