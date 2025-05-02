import { render, screen } from "@testing-library/react";

import { Content } from "../../components/home/content";
import "@testing-library/jest-dom";

// Mock the dynamically imported components
jest.mock("../components/charts/steam", () => ({
  Steam: () => <div data-testid="mock-chart">Chart</div>,
}));
jest.mock("../components/table/table", () => ({
  TableWrapper: () => <div data-testid="mock-table">Table</div>,
}));
jest.mock("../components/home/card-balance1", () => ({
  CardBalance1: () => <div data-testid="balance1">Balance1</div>,
}));
jest.mock("../components/home/card-balance2", () => ({
  CardBalance2: () => <div data-testid="balance2">Balance2</div>,
}));
jest.mock("../components/home/card-balance3", () => ({
  CardBalance3: () => <div data-testid="balance3">Balance3</div>,
}));
jest.mock("../components/home/card-agents", () => ({
  CardAgents: () => <div data-testid="agents">Agents</div>,
}));
jest.mock("../components/home/card-transactions", () => ({
  CardTransactions: () => <div data-testid="transactions">Transactions</div>,
}));

// Mock useTheme
jest.mock("next-themes", () => ({
  useTheme: () => ({ theme: "light" }),
}));

describe("Content Component", () => {
  it("renders main sections and headings", () => {
    render(<Content />);

    expect(screen.getByText(/Available Balance/i)).toBeInTheDocument();
    expect(screen.getByText(/Statistics/i)).toBeInTheDocument();
    expect(screen.getByText(/Section/i)).toBeInTheDocument();
    expect(screen.getByText(/Latest Users/i)).toBeInTheDocument();
  });

  it("renders the View All link", () => {
    render(<Content />);
    const link = screen.getByText(/View All/i);
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/accounts");
  });

  it("renders mock components", () => {
    render(<Content />);
    expect(screen.getByTestId("mock-chart")).toBeInTheDocument();
    expect(screen.getByTestId("mock-table")).toBeInTheDocument();
    expect(screen.getByTestId("balance1")).toBeInTheDocument();
    expect(screen.getByTestId("balance2")).toBeInTheDocument();
    expect(screen.getByTestId("balance3")).toBeInTheDocument();
    expect(screen.getByTestId("agents")).toBeInTheDocument();
    expect(screen.getByTestId("transactions")).toBeInTheDocument();
  });
});
