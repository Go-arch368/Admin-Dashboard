import { render, screen } from "@testing-library/react";

import { CardTransactions } from "@/components/home/card-transactions"; // Adjust the import path as necessary

import "@testing-library/jest-dom";
import { ThemeProvider } from "next-themes"; // Wrap with ThemeProvider

const renderWithTheme = (ui: React.ReactNode) =>
  render(<ThemeProvider attribute="class">{ui}</ThemeProvider>);

describe("CardTransactions", () => {
  it('should render the title "Latest Transactions"', () => {
    renderWithTheme(<CardTransactions />);
    expect(screen.getByText("Latest Transactions")).toBeInTheDocument();
  });

  it("should render transaction details", () => {
    renderWithTheme(<CardTransactions />);

    // Check if each transaction's name, amount, and date are present
    transactions.forEach((transaction) => {
      expect(screen.getByText(transaction.name)).toBeInTheDocument();
      expect(screen.getByText(transaction.amount)).toBeInTheDocument();
      expect(screen.getByText(transaction.date)).toBeInTheDocument();
    });
  });

  it("should render the profile images for each transaction", () => {
    renderWithTheme(<CardTransactions />);

    transactions.forEach((_, index) => {
      const img = screen.getByAltText(`Jose Perez`) as HTMLImageElement;
      expect(img).toBeInTheDocument();
      expect(img.src).toContain(
        `https://i.pravatar.cc/48?u=a042581f4e29026024d&img=${index}`,
      );
    });
  });

  it("should apply the correct classes for dark mode", () => {
    renderWithTheme(<CardTransactions />);

    // Set dark mode by changing the theme
    document.documentElement.classList.add("dark");

    // Check if dark mode styles are applied (e.g., text-white for dark mode)
    expect(screen.getByText("Latest Transactions")).toHaveClass("text-white");

    transactions.forEach((transaction) => {
      expect(screen.getByText(transaction.name)).toHaveClass("text-white");
      expect(screen.getByText(transaction.amount)).toHaveClass(
        "text-green-400",
      );
      expect(screen.getByText(transaction.date)).toHaveClass("text-gray-400");
    });
  });

  it("should apply the correct classes for light mode", () => {
    renderWithTheme(<CardTransactions />);

    // Check if light mode styles are applied (e.g., text-black for light mode)
    expect(screen.getByText("Latest Transactions")).toHaveClass("text-black");

    transactions.forEach((transaction) => {
      expect(screen.getByText(transaction.name)).toHaveClass("text-gray-800");
      expect(screen.getByText(transaction.amount)).toHaveClass(
        "text-green-600",
      );
      expect(screen.getByText(transaction.date)).toHaveClass(
        "text-default-500",
      );
    });
  });
});

const transactions = [
  { name: "Jose Perez", amount: "4500 USD", date: "9/20/2021" },
  { name: "Andrew Steven", amount: "4500 USD", date: "9/20/2021" },
  { name: "Ruben Garcia", amount: "1500 USD", date: "2/20/2022" },
  { name: "Perla Garcia", amount: "200 USD", date: "3/20/2022" },
  { name: "Mathew Funez", amount: "2444 USD", date: "5/20/2022" },
  { name: "Carlos Diaz", amount: "3000 USD", date: "12/20/2022" },
];
