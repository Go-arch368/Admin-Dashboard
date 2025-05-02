import { render } from "@testing-library/react";
import React from "react";

import accounts from "./page"; // Adjust the import path as necessary

// Mock the Accounts component
jest.mock("../../components/accounts/index", () => {
  const MockedComponent = () => (
    <div data-testid="accounts-component">Accounts Component</div>
  );

  MockedComponent.displayName = "MockAccountsComponent"; // Set displayName

  return MockedComponent;
});

describe("Accounts Page", () => {
  it("should render without crashing", () => {
    const { container } = render(React.createElement(accounts));
    expect(container).toBeInTheDocument();
  });

  it("should render the Accounts component", () => {
    const { getByTestId } = render(React.createElement(accounts));
    expect(getByTestId("accounts-component")).toBeInTheDocument();
  });

  it("should match snapshot", () => {
    const { asFragment } = render(React.createElement(accounts));
    expect(asFragment()).toMatchSnapshot();
  });
});
