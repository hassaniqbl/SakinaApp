import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/users");
      setUsers(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const addUser = async () => {
    if (!name || !email) {
      alert("Please fill all fields");
      return;
    }

    try {
      await axios.post("http://localhost:5000/users", {
        name,
        email,
      });

      setName("");
      setEmail("");

      fetchUsers();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>React + Node.js + MySQL</h1>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: "10px", marginRight: "10px" }}
        />

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: "10px", marginRight: "10px" }}
        />

        <button
          onClick={addUser}
          style={{
            padding: "10px 20px",
            cursor: "pointer",
          }}
        >
          Add User
        </button>
      </div>

      <hr />

      <h2>Users List</h2>

      {users.map((user) => (
        <div
          key={user.id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginTop: "10px",
            borderRadius: "5px",
          }}
        >
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </div>
      ))}
    </div>
  );
}

export default App;