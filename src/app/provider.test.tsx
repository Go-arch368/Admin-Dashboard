import { render, screen } from "@testing-library/react";

import { Providers } from "@/app/providers";

// Mocking the actual NextUIProvider and NextThemesProvider to test their presence
jest.mock("@nextui-org/react", () => ({
  NextUIProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

jest.mock("next-themes", () => ({
  NextThemesProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

describe("Providers Component", () => {
  it("renders the children after client-side hydration", () => {
    render(
      <Providers>
        <div>Child Component</div>
      </Providers>,
    );

    // Check if the child component is rendered, indicating that Providers rendered correctly
    expect(screen.getByText("Child Component")).toBeInTheDocument();
  });
});
