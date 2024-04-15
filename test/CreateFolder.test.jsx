import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import { CreateFolder } from "../src/components/Modal/CreateFolder";

jest.mock("axios");

describe("CreateFolder component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("validates folder name length and special characters", async () => {
    render(<CreateFolder />);

    const input = screen.getByRole("textbox");
    const button = screen.getByRole("button", { name: /만들기/i });

    fireEvent.change(input, { target: { value: "aa" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/폴더 이름은 3자 이상, 10자 이하/)).toBeTruthy();
    });

    fireEvent.change(input, { target: { value: "!@#" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/특수문자를 포함할 수 없습니다/)).toBeTruthy();
    });
  });

  it("submits form with valid folder name", async () => {
    render(<CreateFolder />);

    const input = screen.getByRole("textbox");
    const button = screen.getByRole("button", { name: /만들기/i });

    fireEvent.change(input, { target: { value: "Valid Folder" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(
        screen.findByText(/성공적으로 폴더가 만들어졌습니다/),
      ).toBeTruthy();
    });
  });

  it("displays error message if server responds with error", async () => {
    axios.post.mockRejectedValueOnce({
      response: { status: 404, data: { message: "Not found" } },
    });

    render(<CreateFolder />);

    const input = screen.getByRole("textbox");
    const button = screen.getByRole("button", { name: /만들기/i });

    fireEvent.change(input, { target: { value: "Valid Folder" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.findByText(/Not found/)).toBeTruthy();
    });
  });
});
