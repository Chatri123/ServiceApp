// src/App.jsx
import React, { useState } from "react";

// Mock employees
const mockEmployees = [
  { id: 1, name: "Alice", clockedIn: false, jobs: [] },
  { id: 2, name: "Bob", clockedIn: false, jobs: [] },
];

// Mock jobs template
const jobTemplate = [
  { id: 1, name: "Clean Roof", rate: 60 },
  { id: 2, name: "Window Repair", rate: 45 },
  { id: 3, name: "Gutter Cleaning", rate: 50 },
];

// Utility to simulate GPS
const getRandomLocation = () => ({
  lat: (Math.random() * 0.1 + 37.7749).toFixed(5), // Example: around San Francisco
  lng: (Math.random() * 0.1 - 122.4194).toFixed(5),
});

function Dashboard({ user }) {
  const [employees, setEmployees] = useState(mockEmployees);

  // Toggle clock in/out
  const toggleClock = (id) => {
    setEmployees(
      employees.map(emp =>
        emp.id === id
          ? { ...emp, clockedIn: !emp.clockedIn }
          : emp
      )
    );
  };

  // Complete a job
  const completeJob = (empId, jobId) => {
    setEmployees(
      employees.map(emp => {
        if (emp.id !== empId) return emp;
        const jobs = emp.jobs.map(job =>
          job.id === jobId ? { ...job, completed: !job.completed } : job
        );
        return { ...emp, jobs };
      })
    );
  };

  // Assign a new job to an employee
  const assignJob = (empId, job) => {
    setEmployees(
      employees.map(emp =>
        emp.id === empId
          ? { ...emp, jobs: [...emp.jobs, { ...job, completed: false, gps: getRandomLocation() }] }
          : emp
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-6">
      <h1 className="text-3xl font-bold">Welcome, {user.displayName || user.email}!</h1>

      {employees.map(emp => (
        <div key={emp.id} className="bg-white p-4 rounded shadow space-y-2">
          <h2 className="text-xl font-semibold">{emp.name}</h2>
          <button
            onClick={() => toggleClock(emp.id)}
            className={`px-3 py-1 rounded ${
              emp.clockedIn ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
            } text-white`}
          >
            {emp.clockedIn ? "Clock Out" : "Clock In"}
          </button>

          <button
            onClick={() => assignJob(emp.id, jobTemplate[Math.floor(Math.random() * jobTemplate.length)])}
            className="ml-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded"
          >
            Assign Random Job
          </button>

          {emp.jobs.length > 0 && (
            <ul className="mt-2 space-y-1">
              {emp.jobs.map(job => (
                <li key={job.id} className="flex justify-between items-center p-2 border rounded">
                  <div>
                    <span className={job.completed ? "line-through" : ""}>
                      {job.name} (${job.rate})
                    </span>
                    <div className="text-xs text-gray-500">
                      GPS: {job.gps.lat}, {job.gps.lng}
                    </div>
                  </div>
                  <button
                    onClick={() => completeJob(emp.id, job.id)}
                    className="px-2 py-1 bg-green-500 hover:bg-green-600 text-white rounded"
                  >
                    {job.completed ? "Undo" : "Complete"}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}

      {/* Admin summary */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Admin Dashboard</h2>
        {employees.map(emp => {
          const total = emp.jobs.reduce((sum, job) => sum + (job.completed ? job.rate : 0), 0);
          return (
            <div key={emp.id} className="flex justify-between mb-1">
              <span>{emp.name} Total: ${total}</span>
              <button
                onClick={() => alert(`Paid $${total} to ${emp.name}!`)}
                className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded"
              >
                Pay Now
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Temporary Login component
function Login({ setCurrentUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleTestLogin = () => {
    const user = { uid: "testuser123", email: "test@test.com", displayName: "Test User" };
    setCurrentUser(user);
    alert("Logged in as Test User!");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">ServiceOps Login (Test Mode)</h1>
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
      <button
        onClick={handleTestLogin}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Login as Test User
      </button>
    </div>
  );
}

// Main App
export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  return !currentUser ? <Login setCurrentUser={setCurrentUser} /> : <Dashboard user={currentUser} />;
}
