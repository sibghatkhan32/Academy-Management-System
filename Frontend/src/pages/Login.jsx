import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as loginApi } from "../services/authService"; // Renamed to avoid conflicts
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { login: loginContext } = useAuth(); // Call hooks at the top level and rename

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

        // Login request
        const data = await loginApi(username, password);

        console.log("Login Response:", data);

        // Save only the JWT token
        loginContext(data.access_token);

        // Redirect to dashboard
        navigate("/dashboard");

    } catch (error) {

        console.error(error);
        alert("Invalid username or password");

    }
};

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gray-100">
      <div className="w-[500px] rounded-lg bg-white shadow-lg p-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          <label className="font-semibold">
            Username
          </label>

          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border rounded-md p-2"
          />

          <label className="font-semibold">
            Password
          </label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded-md p-2"
          />

          <button
            type="submit"
            className="bg-blue-700 text-white rounded-md p-2 mt-4"
          >
            Login
          </button>

        </form>
      </div>
    </div>
  );
};

export default Login;
