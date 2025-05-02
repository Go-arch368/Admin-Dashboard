import { render, screen, fireEvent } from "@testing-library/react";

import { IconButton, StyledBadge } from "@/components/table/table.styled";

describe("IconButton", () => {
  it("renders the button with children correctly", () => {
    render(<IconButton>Click Me</IconButton>);

    // Check if the button with text 'Click Me' is rendered
    expect(screen.getByText("Click Me")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<IconButton className="custom-class">Click Me</IconButton>);

    // Check if the custom class is applied
    const button = screen.getByText("Click Me");
    expect(button).toHaveClass("custom-class");
  });

  it("handles onClick event", () => {
    const handleClick = jest.fn();
    render(<IconButton onClick={handleClick}>Click Me</IconButton>);

    const button = screen.getByText("Click Me");
    fireEvent.click(button);

    // Ensure the click handler is called
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

describe("StyledBadge", () => {
  it("renders with active type", () => {
    render(<StyledBadge type="active">Active</StyledBadge>);

    // Check if the text is displayed correctly
    expect(screen.getByText("Active")).toBeInTheDocument();

    // Check if the correct class is applied (active badge)
    const badge = screen.getByText("Active");
    expect(badge).toHaveClass("bg-green-200");
    expect(badge).toHaveClass("text-green-700");
  });

  it("renders with paused type", () => {
    render(<StyledBadge type="paused">Paused</StyledBadge>);

    // Check if the text is displayed correctly
    expect(screen.getByText("Paused")).toBeInTheDocument();

    // Check if the correct class is applied (paused badge)
    const badge = screen.getByText("Paused");
    expect(badge).toHaveClass("bg-red-200");
    expect(badge).toHaveClass("text-red-700");
  });

  it("renders with vacation type", () => {
    render(<StyledBadge type="vacation">Vacation</StyledBadge>);

    // Check if the text is displayed correctly
    expect(screen.getByText("Vacation")).toBeInTheDocument();

    // Check if the correct class is applied (vacation badge)
    const badge = screen.getByText("Vacation");
    expect(badge).toHaveClass("bg-yellow-200");
    expect(badge).toHaveClass("text-yellow-700");
  });
});
