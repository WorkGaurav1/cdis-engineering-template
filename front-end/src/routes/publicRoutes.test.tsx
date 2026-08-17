import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import type { PropsWithChildren, ReactElement } from "react";

import { AuthContext } from "@/auth/context/AuthContext";
import type { AuthContextValue } from "@/auth/context/AuthContext";
import type { User } from "@/auth/types";

import { publicRoutes } from "./publicRoutes";

function renderAt(path: string, user: User | null, loading = false) {
  const value: AuthContextValue = { user, isAuthenticated: user !== null, loading, login: async () => {}, logout: async () => {} };

  function Wrapper({ children }: PropsWithChildren): ReactElement {
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
  }

  const router = createMemoryRouter(
    [...publicRoutes, { path: "/dashboard", element: <p>Dashboard Page</p> }],
    { initialEntries: [path] },
  );

  return render(
    <Wrapper>
      <RouterProvider router={router} />
    </Wrapper>,
  );
}

const user: User = { id: "u1", name: "Test", email: "t@example.com", roles: ["user"], permissions: [] };

describe("publicRoutes", () => {
  it("root path sends an unauthenticated visitor to the login form", async () => {
    renderAt("/", null);

    expect(await screen.findByRole("button", { name: "Sign In" })).toBeInTheDocument();
  });

  it("root path sends an authenticated visitor straight to the dashboard", async () => {
    renderAt("/", user);

    expect(await screen.findByText("Dashboard Page")).toBeInTheDocument();
  });

  it("renders the login form at /login for an unauthenticated visitor", async () => {
    renderAt("/login", null);

    expect(await screen.findByRole("button", { name: "Sign In" })).toBeInTheDocument();
  });

  it("redirects an already-authenticated visitor away from /login to the dashboard", async () => {
    renderAt("/login", user);

    expect(await screen.findByText("Dashboard Page")).toBeInTheDocument();
  });
});
