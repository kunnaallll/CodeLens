import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { AuthContext } from "../context/AuthContext";
import ProtectedRoute from "./ProtectedRoute";

function renderWithAuth(authValue, { adminOnly = false, initialPath = "/dashboard" } = {}) {
  return render(
    <AuthContext.Provider value={authValue}>
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route element={<ProtectedRoute adminOnly={adminOnly} />}>
            <Route path="/dashboard" element={<div>Dashboard Page</div>} />
            <Route path="/admin" element={<div>Admin Page</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  );
}

describe("ProtectedRoute", () => {
  it("shows a loading state while the session is being checked", () => {
    renderWithAuth({ loading: true, isAuthenticated: false, isAdmin: false });
    expect(screen.getByText(/checking your session/i)).toBeInTheDocument();
  });

  it("redirects unauthenticated users to /login", () => {
    renderWithAuth({ loading: false, isAuthenticated: false, isAdmin: false });
    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });

  it("renders the protected page for an authenticated user", () => {
    renderWithAuth({ loading: false, isAuthenticated: true, isAdmin: false });
    expect(screen.getByText("Dashboard Page")).toBeInTheDocument();
  });

  it("redirects a non-admin student away from an admin-only route", () => {
    renderWithAuth(
      { loading: false, isAuthenticated: true, isAdmin: false },
      { adminOnly: true, initialPath: "/admin" }
    );
    expect(screen.queryByText("Admin Page")).not.toBeInTheDocument();
  });

  it("renders an admin-only route for an admin user", () => {
    renderWithAuth(
      { loading: false, isAuthenticated: true, isAdmin: true },
      { adminOnly: true, initialPath: "/admin" }
    );
    expect(screen.getByText("Admin Page")).toBeInTheDocument();
  });
});
