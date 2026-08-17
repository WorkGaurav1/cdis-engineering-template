import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import { AuthContext, type AuthContextValue } from "@/auth/context/AuthContext";
import type { User } from "@/auth/types";

import ProfileMenu from "./ProfileMenu";

function renderWithUser(user: User | null, overrides: Partial<AuthContextValue> = {}) {
  const logout = vi.fn().mockResolvedValue(undefined);
  const value: AuthContextValue = {
    user,
    isAuthenticated: user !== null,
    loading: false,
    login: vi.fn(),
    logout,
    ...overrides,
  };

  const utils = render(
    <MemoryRouter>
      <AuthContext.Provider value={value}>
        <ProfileMenu />
      </AuthContext.Provider>
    </MemoryRouter>,
  );

  return { ...utils, logout };
}

const baseUser: User = {
  id: "u1",
  name: "Jane Doe",
  email: "jane@example.com",
  roles: ["manager"],
  permissions: ["users:read"],
};

describe("ProfileMenu", () => {
  it("renders nothing when there is no authenticated user", () => {
    const { container } = renderWithUser(null);

    expect(container).toBeEmptyDOMElement();
  });

  it("shows the user's initials, name, and capitalized primary role", () => {
    renderWithUser(baseUser);

    expect(screen.getByText("JD")).toBeInTheDocument();
    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByText("Manager")).toBeInTheDocument();
  });

  it("omits the role line when the user has no roles", () => {
    renderWithUser({ ...baseUser, roles: [] });

    expect(screen.queryByText("Manager")).not.toBeInTheDocument();
  });

  it("shows the user's name and email inside the opened menu", async () => {
    const user = userEvent.setup();
    renderWithUser(baseUser);

    await user.click(screen.getByRole("button", { name: "Account menu" }));

    expect(await screen.findByText("jane@example.com")).toBeInTheDocument();
  });

  it("calls logout when 'Log out' is selected", async () => {
    const user = userEvent.setup();
    const { logout } = renderWithUser(baseUser);

    await user.click(screen.getByRole("button", { name: "Account menu" }));
    await user.click(await screen.findByText("Log out"));

    expect(logout).toHaveBeenCalledOnce();
  });
});
