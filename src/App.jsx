// src/App.jsx
import { useState } from "react";

// Temporary Dashboard component
function Dashboard({ user }) {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4">
        Welcome, {user.displayName || user.email}!
      </h1>

      <div className="space-y-4">
        <div className="p-4 bg-white rounded shadow">
          <h2 className="text-xl font-semibold">Employee Dashboard</h2>
          <p>Clock in/out, track jobs, and GPS here (mocked for test user).</p>
        </div>

        <div className="p-4 bg-white rounded shadow">
          <h2 className="text-xl font-semibold">Admin Dashboard</h2>
          <p>Check jobs completed and calculate payments here (mocked for test user).</p>
        </div>
      </div>
    </div>
  );
}

// Temporary Login component
function Login({ setCurrentUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // TEMPORARY TEST LOGIN — bypasses Firebase
  const handleTestLogin = () => {
    const user = {
      uid: "testuser123",
      email: "test@test.com",
      displayName: "Test User",
    };
    setCurrentUser(user); // set the logged-in user
    alert("Logged in as Test User!");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">ServiceOps Login (Test Mode)</h1>

      {/* Optional: normal login inputs for later */}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-2 p-2 border rounded w-64"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mb-4 p-2 border rounded w-64"
      />

      {/* Test login button */}
      <button
        onClick={handleTestLogin}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Login as Test User
      </button>
    </div>
  );
}

// Main App component
export default function App() {
  const [currentUser, setCurrentUser] = useState(null);

  return (
    <>
      {!currentUser ? (
        <Login setCurrentUser={setCurrentUser} />
      ) : (
        <Dashboard user={currentUser} />
      )}
    </>
  );
}
