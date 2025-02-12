import { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000/api/admin/users", { withCredentials: true })
      .then(res => setUsers(res.data))
      .catch(err => console.log(err));
  }, []);

  const deleteUser = async (id) => {
    await axios.delete(`http://localhost:3000/api/admin/users/${id}`, { withCredentials: true });
    setUsers(users.filter(user => user.id !== id));
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <h2>Manage Users</h2>
      {users.map(user => (
        <div key={user.id}>
          <p>{user.username} ({user.email})</p>
          <button onClick={() => deleteUser(user.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default AdminDashboard;
