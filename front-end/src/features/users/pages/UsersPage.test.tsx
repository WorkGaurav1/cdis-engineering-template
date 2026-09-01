import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { PropsWithChildren, ReactElement } from "react";

vi.mock("../api/userApi", () => ({
  userApi: { list: vi.fn() },
}));

const { userApi } = await import("../api/userApi");
const { default: UsersPage } = await import("./UsersPage");

function renderPage() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  function Wrapper({ children }: PropsWithChildren): ReactElement {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  }
  return render(<UsersPage />, { wrapper: Wrapper });
}

function fakeUser(id: string) {
  return { id, name: `User ${id}`, email: `${id}@example.com`, roles: ["user"], permissions: [] };
}

describe("UsersPage", () => {
  it("fetches the first page on mount, with the configured page size", async () => {
    vi.mocked(userApi.list).mockResolvedValue({ users: [], pagination: { limit: 20, offset: 0, total: 0 } });

    renderPage();

    await screen.findByText("No users found.");
    expect(userApi.list).toHaveBeenCalledWith({ limit: 20, offset: 0 });
  });

  it("shows an error message when the fetch fails", async () => {
    vi.mocked(userApi.list).mockRejectedValue(new Error("network down"));

    renderPage();

    expect(await screen.findByText("Failed to load users.")).toBeInTheDocument();
  });

  it("renders the fetched page of users and the real total from the server, not just this page's length", async () => {
    vi.mocked(userApi.list).mockResolvedValue({
      users: [fakeUser("u1")],
      pagination: { limit: 1, offset: 0, total: 45 },
    });

    renderPage();

    expect(await screen.findByText("u1@example.com")).toBeInTheDocument();
    expect(screen.getByText(/45 total/)).toBeInTheDocument();
  });

  it("requests the next page with the correct offset when Next is clicked — a real new fetch, not client-side re-slicing", async () => {
    const user = userEvent.setup();
    // total (25) must exceed the page's own real PAGE_SIZE (20, a
    // UsersPage constant, not something this mock controls) for a
    // second page — and therefore an enabled Next button — to exist.
    vi.mocked(userApi.list).mockResolvedValue({
      users: [fakeUser("u1")],
      pagination: { limit: 20, offset: 0, total: 25 },
    });

    renderPage();
    await screen.findByText("u1@example.com");

    vi.mocked(userApi.list).mockResolvedValue({
      users: [fakeUser("u2")],
      pagination: { limit: 20, offset: 20, total: 25 },
    });

    await user.click(screen.getByRole("button", { name: "Next" }));

    expect(await screen.findByText("u2@example.com")).toBeInTheDocument();
    expect(userApi.list).toHaveBeenLastCalledWith({ limit: 20, offset: 20 });
  });
});
