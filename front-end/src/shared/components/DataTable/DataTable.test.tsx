import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "./DataTable";

interface Row {
  name: string;
  age: number;
}

const columns: ColumnDef<Row, unknown>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "age", header: "Age" },
];

const rows: Row[] = [
  { name: "Charlie", age: 25 },
  { name: "Alice", age: 40 },
  { name: "Bob", age: 30 },
];

describe("DataTable", () => {
  it("renders every row and column header", () => {
    render(<DataTable columns={columns} data={rows} />);

    expect(screen.getByRole("columnheader", { name: /Name/ })).toBeInTheDocument();
    expect(screen.getByText("Charlie")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });

  it("shows the loading state instead of any rows while isLoading", () => {
    render(<DataTable columns={columns} data={rows} isLoading />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(screen.queryByText("Charlie")).not.toBeInTheDocument();
  });

  it("shows the empty message when there is no data", () => {
    render(<DataTable columns={columns} data={[]} emptyMessage="No records found." />);

    expect(screen.getByText("No records found.")).toBeInTheDocument();
  });

  it("filters rows by the search input, across all columns", async () => {
    const user = userEvent.setup();
    render(<DataTable columns={columns} data={rows} searchPlaceholder="Search rows..." />);

    await user.type(screen.getByRole("searchbox", { name: "Search rows..." }), "ali");

    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.queryByText("Charlie")).not.toBeInTheDocument();
    expect(screen.queryByText("Bob")).not.toBeInTheDocument();
  });

  it("sorts rows ascending then descending when the column header is clicked", async () => {
    const user = userEvent.setup();
    render(<DataTable columns={columns} data={rows} />);

    function bodyRowNames(): string[] {
      const bodyRows = screen.getAllByRole("row").slice(1); // drop header row
      return bodyRows.map((row) => within(row).getAllByRole("cell")[0].textContent ?? "");
    }

    expect(bodyRowNames()).toEqual(["Charlie", "Alice", "Bob"]);

    await user.click(screen.getByRole("button", { name: /Name/ }));
    expect(bodyRowNames()).toEqual(["Alice", "Bob", "Charlie"]);

    await user.click(screen.getByRole("button", { name: /Name/ }));
    expect(bodyRowNames()).toEqual(["Charlie", "Bob", "Alice"]);
  });

  it("hides pagination controls when everything fits on one page", () => {
    render(<DataTable columns={columns} data={rows} />);

    expect(screen.queryByRole("button", { name: "Next" })).not.toBeInTheDocument();
  });

  it("paginates when there are more rows than the page size, and Previous/Next work", async () => {
    const user = userEvent.setup();
    const manyRows: Row[] = Array.from({ length: 12 }, (_, i) => ({ name: `Row ${String(i + 1)}`, age: i }));
    render(<DataTable columns={columns} data={manyRows} />);

    expect(screen.getByText("Page 1 of 2")).toBeInTheDocument();
    expect(screen.getByText("Row 1")).toBeInTheDocument();
    expect(screen.queryByText("Row 11")).not.toBeInTheDocument();

    const previousButton = screen.getByRole("button", { name: "Previous" });
    const nextButton = screen.getByRole("button", { name: "Next" });
    expect(previousButton).toBeDisabled();

    await user.click(nextButton);

    expect(screen.getByText("Page 2 of 2")).toBeInTheDocument();
    expect(screen.getByText("Row 11")).toBeInTheDocument();
    expect(nextButton).toBeDisabled();

    await user.click(previousButton);
    expect(screen.getByText("Page 1 of 2")).toBeInTheDocument();
  });
});
