import { render, screen, fireEvent } from "@testing-library/react";

import { users } from "@/components/table/data";
import { RenderCell } from "@/components/table/render-cell";

// Mock the icons
jest.mock("../icons/table/delete-icon", () => ({
  DeleteIcon: () => <svg>Delete Icon</svg>,
}));
jest.mock("../icons/table/edit-icon", () => ({
  EditIcon: () => <svg>Edit Icon</svg>,
}));
jest.mock("../icons/table/eye-icon", () => ({
  EyeIcon: () => <svg>View Icon</svg>,
}));

describe("RenderCell", () => {
  const user = users[0]; // Use the first user for testing

  it("renders user name and avatar correctly", () => {
    render(<RenderCell user={user} columnKey="name" />);

    // Check if the user's avatar and name are displayed correctly
    expect(screen.getByAltText(user.name)).toBeInTheDocument();
    expect(screen.getByText(user.name)).toBeInTheDocument();
  });

  it("renders user role correctly", () => {
    render(<RenderCell user={user} columnKey="role" />);

    // Check if the user's role is displayed correctly
    expect(screen.getByText(user.role)).toBeInTheDocument();
  });

  it("renders user status correctly with badge", () => {
    render(<RenderCell user={user} columnKey="status" />);

    // Check if the user's status is displayed correctly
    const badge = screen.getByText(user.status);
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass(user.status); // Check that the badge class is correct (active, paused, vacation)
  });

  it("renders action buttons correctly", () => {
    render(<RenderCell user={user} columnKey="actions" />);

    // Check if the action buttons are rendered
    const viewButton = screen.getByLabelText("View");
    const editButton = screen.getByLabelText("Edit");
    const deleteButton = screen.getByLabelText("Delete");

    // Check if the buttons are in the document
    expect(viewButton).toBeInTheDocument();
    expect(editButton).toBeInTheDocument();
    expect(deleteButton).toBeInTheDocument();

    // Simulate button clicks
    fireEvent.click(viewButton);
    expect(console.log).toHaveBeenCalledWith("View user", user.id);

    fireEvent.click(editButton);
    expect(console.log).toHaveBeenCalledWith("Edit user", user.id);

    fireEvent.click(deleteButton);
    expect(console.log).toHaveBeenCalledWith("Delete user", user.id);
  });
});
