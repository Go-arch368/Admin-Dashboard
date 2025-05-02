import { render, screen } from "@testing-library/react";

import RootLayout from "@/app/layout"; // Adjust the import according to your file structure
import { Layout } from "@/components/layout/layout";
import { ThemeProvider } from "@/components/theme-provider";

// Mock the Analytics component since it's a third-party dependency
jest.mock("@vercel/analytics/react", () => ({
  Analytics: () => <div>Analytics Component</div>,
}));

// Custom render function to wrap RootLayout with necessary providers
const customRender = (ui: React.ReactNode) =>
  render(
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <Layout>{ui}</Layout>
    </ThemeProvider>,
  );

describe("RootLayout", () => {
  it("renders without crashing", () => {
    customRender(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>,
    );

    // Check if the content rendered correctly
    expect(screen.getByText(/Test Content/i)).toBeInTheDocument();
  });

  it("renders Vercel Analytics component", () => {
    customRender(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>,
    );

    // Check if the Analytics component is rendered
    expect(screen.getByText(/Analytics Component/i)).toBeInTheDocument();
  });

  it("renders the correct page title", () => {
    customRender(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>,
    );

    // Check if the document title is set correctly
    expect(document.title).toBe("NextJs 15");
  });
});
