// frontend/src/pages/admin/AdminUsers.jsx
import { useState, useEffect } from 'react';
import { adminAPI } from '../../api/admin.api';
import { formatDate } from '../../utils/helpers';
import Loader from '../../components/common/Loader';
import '../../styles/admin.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await adminAPI.getAllUsers();
      if (response.status === 'success') {
        setUsers(response.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <Loader />;

  return (
    <div className="admin-users">
      <div className="admin-header">
        <div>
          <h1>Users Management</h1>
          <p>View all registered users</p>
        </div>
      </div>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search users by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="users-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Verified</th>
              <th>Registered</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user._id}>
                <td>
                  <strong>{user.firstName} {user.lastName}</strong>
                </td>
                <td>{user.email}</td>
                <td>
                  <span className={`verified-badge ${user.verified ? 'verified' : 'not-verified'}`}>
                    {user.verified ? '✓ Verified' : '✗ Not Verified'}
                  </span>
                </td>
                <td>{formatDate(user.createdAt)}</td>
                <td>
                  <span className="role-badge">
                    {user.role === 'admin' || user.isAdmin ? 'Admin' : 'User'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className="no-data">
            <p>No users found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;