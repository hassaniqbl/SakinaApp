import { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./App.css";

const API_BASE = "http://localhost:5000";

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [message, setMessage] = useState({ type: "success", text: "" });
  const messageTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);
    };
  }, []);

  const showMessage = (type, text) => {
    setMessage({ type, text });

    if (messageTimeoutRef.current) clearTimeout(messageTimeoutRef.current);

    messageTimeoutRef.current = setTimeout(() => {
      setMessage({ type: "success", text: "" });
    }, 3000);
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_BASE}/users`);
      setUsers(res.data);
    } catch (error) {
      console.error(error);
      showMessage("error", "Failed to load users");
    }
  };

  useEffect(() => {
    const load = async () => {
      await fetchUsers();
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setEmail("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      showMessage("error", "Please fill all fields");
      return;
    }

    try {
      if (editingId === null) {
        await axios.post(`${API_BASE}/users`, {
          name,
          email,
        });
        showMessage("success", "User created successfully");
      } else {
        await axios.put(`${API_BASE}/users/${editingId}`, {
          name,
          email,
        });
        showMessage("success", "User updated successfully");
      }

      resetForm();
      fetchUsers();
    } catch (error) {
      console.error(error);
      const msg =
        error?.response?.data?.message || "Failed to save user";
      showMessage("error", msg);
    }
  };

  const handleEdit = async (user) => {
    setEditingId(user.id);
    setName(user.name);
    setEmail(user.email);

    showMessage("success", "Editing mode enabled");
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this user?");
    if (!ok) return;

    try {
      await axios.delete(`${API_BASE}/users/${id}`);
      showMessage("success", "User deleted successfully");

      // If we were editing the same user, exit edit mode.
      if (editingId === id) resetForm();

      fetchUsers();
    } catch (error) {
      console.error(error);
      const msg =
        error?.response?.data?.message || "Failed to delete user";
      showMessage("error", msg);
    }
  };

  return (
    <div className="page">
      <div className="container">
        <h1 className="title">User Module CRUD</h1>

        {message.text ? (
          <div
            className={`message ${
              message.type === "error" ? "message--error" : "message--success"
            }`}
            role="status"
          >
            {message.text}
          </div>
        ) : null}

        <form className="card" onSubmit={handleSubmit}>
          <h2 className="cardTitle">{editingId === null ? "Add User" : "Update User"}</h2>

          <div className="formGrid">
            <label className="field">
              <span>Name</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter Name"
                autoComplete="off"
              />
            </label>

            <label className="field">
              <span>Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Email"
                autoComplete="off"
              />
            </label>
          </div>

          <div className="actions">
            <button className="btn btnPrimary" type="submit">
              {editingId === null ? "Add User" : "Update User"}
            </button>

            {editingId !== null ? (
              <button
                className="btn"
                type="button"
                onClick={() => resetForm()}
              >
                Cancel
              </button>
            ) : null}
          </div>
        </form>

        <div className="card tableCard">
          <h2 className="cardTitle">Users</h2>

          <div className="tableWrap">
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: 80 }}>User ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th style={{ width: 200 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="empty">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <div className="rowActions">
                          <button
                            type="button"
                            className="btn btnSmall"
                            onClick={() => handleEdit(user)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="btn btnDanger btnSmall"
                            onClick={() => handleDelete(user.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

