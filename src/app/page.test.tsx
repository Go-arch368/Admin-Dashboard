import { render, screen } from "@testing-library/react";

import Home from "@/app/page";

// Mock the Content component to avoid testing its internal logic if needed
jest.mock("../components/home/content", () => ({
  Content: () => <div>Content Component</div>,
}));

describe("Home", () => {
  it("renders Content component", () => {
    render(<Home />);

    // Check if the Content component is rendered correctly
    expect(screen.getByText(/Content Component/i)).toBeInTheDocument();
  });
});
