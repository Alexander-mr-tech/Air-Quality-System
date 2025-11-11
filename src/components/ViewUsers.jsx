import React from "react";
import { Link } from "react-router-dom";

const ViewUsers = () => {
  // Simulated user data
  const users = [
    { id: 1, name: "John Doe", email: "johndoe@example.com" },
    { id: 2, name: "Jane Smith", email: "janesmith@example.com" },
    { id: 3, name: "Mark Johnson", email: "markj@example.com" },
  ];

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        maxWidth: "1000px",
        margin: "auto",
      }}
    >
      <h2 className="text-center mb-4">View Users</h2>
      <p className="text-center">
        Below is the list of all users currently in the system. You can manage them here.
      </p>

      {/* Table to display users */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                {/* Edit and Remove buttons */}
                <Link to={`/edit-user/${user.id}`} className="btn btn-warning btn-sm me-2">
                  Edit
                </Link>
                <button className="btn btn-danger btn-sm">Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Back to Dashboard Button */}
      <Link to="/admin-dashboard" className="btn btn-secondary w-100">
        Back to Dashboard
      </Link>
    </div>
  );
};

export default ViewUsers;
