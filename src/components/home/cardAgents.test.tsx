import { render, screen } from "@testing-library/react";

import { CardAgents } from "@/components/home/card-agents"; // Adjust the import path as necessary
import "@testing-library/jest-dom";

describe("CardAgents", () => {
  it("renders the CardAgents component with correct data", () => {
    render(<CardAgents />);
    expect(screen.getByText("⭐")).toBeInTheDocument();
  });
});
