import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";

import type { User } from "@/auth";

import { usersTableColumns } from "./usersTableColumns";

function TestTable({ data }: { data: User[] }) {
  const table = useReactTable({ columns: usersTableColumns, data, getCoreRowModel: getCoreRowModel() });
  return (
    <table>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

describe("usersTableColumns", () => {
  it("joins multiple roles into a single comma-separated cell", () => {
    render(
      <TestTable
        data={[{ id: "u1", name: "Jane", email: "jane@example.com", roles: ["admin", "manager"], permissions: [] }]}
      />,
    );

    expect(screen.getByText("admin, manager")).toBeInTheDocument();
  });

  it("renders an empty string for a user with no roles", () => {
    render(<TestTable data={[{ id: "u1", name: "Jane", email: "jane@example.com", roles: [], permissions: [] }]} />);

    expect(screen.getByText("Jane")).toBeInTheDocument();
    expect(screen.getByText("jane@example.com")).toBeInTheDocument();
  });
});
