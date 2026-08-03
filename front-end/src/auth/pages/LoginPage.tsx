import { useLogin } from "../hooks";

export default function LoginPage() {
  const { login, loading } = useLogin();

  async function handleLogin() {
    await login({
      email: "admin@cdis.com",
      password: "password123",
    });
  }

  return (
    <div>
      <h1>Login</h1>

      <button
        onClick={handleLogin}
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </div>
  );
}