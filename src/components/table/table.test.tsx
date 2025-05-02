import { render, screen, fireEvent } from "@testing-library/react";

import { columns, users } from "@/components/table/data";
import TableWrapper from "@/components/table/table";

// Mock data setup for users and columns if needed
jest.mock("@/components/data", () => ({
  users: [
    {
      id: "1",
      name: "John Doe",
      role: "Admin",
      status: "active",
      avatar: "url1",
    },
    {
      id: "2",
      name: "Jane Smith",
      role: "User",
      status: "paused",
      avatar: "url2",
    },
    // Add more mock users as needed
  ],
  columns: [
    { name: "Name", uid: "name" },
    { name: "Role", uid: "role" },
    { name: "Status", uid: "status" },
    { name: "Actions", uid: "actions" },
  ],
}));

describe("TableWrapper", () => {
  it("renders the table with the correct columns and data", () => {
    render(<TableWrapper />);

    // Check if column headers are rendered correctly
    columns.forEach((column) => {
      expect(screen.getByText(column.name)).toBeInTheDocument();
    });

    // Check if user data is rendered in the table (using user name as an example)
    users.forEach((user) => {
      expect(screen.getByText(user.name)).toBeInTheDocument();
    });
  });

  it("paginates correctly", () => {
    render(<TableWrapper />);

    // Check initial pagination
    const page1Button = screen.getByText("1");
    expect(page1Button).toBeInTheDocument();

    // Click the "next" button
    const nextButton = screen.getByLabelText("next-page"); // You can add an aria-label to the button for better query
    fireEvent.click(nextButton);

    // Check that the page number has updated
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("selects multiple rows", () => {
    render(<TableWrapper />);

    // Select the first row
    const firstRowCheckbox = screen.getByLabelText(`select-row-1`); // Add aria-label to checkboxes or use another selector
    fireEvent.click(firstRowCheckbox);

    // Check if the row is selected
    expect(firstRowCheckbox).toBeChecked();

    // Select the second row
    const secondRowCheckbox = screen.getByLabelText(`select-row-2`);
    fireEvent.click(secondRowCheckbox);

    // Check if the second row is selected
    expect(secondRowCheckbox).toBeChecked();
  });

  it("disables the previous button on the first page", () => {
    render(<TableWrapper />);

    // Check that the previous button is disabled on the first page
    const prevButton = screen.getByLabelText("previous-page");
    expect(prevButton).toBeDisabled();
  });

  it("disables the next button on the last page", () => {
    render(<TableWrapper />);
    const ITEMS_PER_PAGE = 5;

    // Simulate being on the last page
    const lastPage = Math.ceil(users.length / ITEMS_PER_PAGE);
    const nextButton = screen.getByLabelText("next-page");

    // Go to the last page
    fireEvent.click(screen.getByText(String(lastPage)));

    // Check if the next button is disabled
    expect(nextButton).toBeDisabled();
  });
});
