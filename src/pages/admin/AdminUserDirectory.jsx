import React, { useState, useEffect } from 'react';
import { userApi, authApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { 
  Users, 
  Search, 
  UserPlus, 
  ShieldCheck, 
  GraduationCap, 
  BookOpen, 
  RefreshCw, 
  X, 
  Sparkles,
  Building,
  Mail,
  Lock
} from 'lucide-react';

export const AdminUserDirectory = () => {
  const { showSuccess, showError } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [facultyFilter, setFacultyFilter] = useState('all');

  // New Admin Modal State
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [creatingAdmin, setCreatingAdmin] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await userApi.getAllUsers();
      setUsers(res.data || []);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    if (!adminEmail || !adminPassword) {
      showError('Please enter both email and password for the new administrator.');
      return;
    }

    setCreatingAdmin(true);
    try {
      const res = await authApi.createAdmin(adminEmail, adminPassword);
      showSuccess(res.message || 'New Administrator account created successfully!');
      setIsAdminModalOpen(false);
      setAdminEmail('');
      setAdminPassword('');
      fetchUsers();
    } catch (err) {
      showError(err.message || 'Failed to create administrator account.');
    } finally {
      setCreatingAdmin(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      u.name?.toLowerCase().includes(term) ||
      u.email?.toLowerCase().includes(term) ||
      u.userId?.toLowerCase().includes(term);

    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesFaculty = facultyFilter === 'all' || u.faculty === facultyFilter;

    return matchesSearch && matchesRole && matchesFaculty;
  });

  return (
    <div>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            <Sparkles size={16} />
            Academic Registry
          </div>
          <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginTop: '0.25rem' }}>
            University User Directory
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.2rem' }}>
            Manage registered students, peer tutors, and department oversight personnel.
          </p>
        </div>

        <button
          onClick={() => setIsAdminModalOpen(true)}
          className="btn btn-primary"
        >
          <UserPlus size={16} /> Register New Admin
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="card"
        style={{
          padding: '1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          backgroundColor: '#FFFFFF',
        }}
      >
        <div style={{ display: 'flex', gap: '0.75rem', flex: 1, minWidth: '280px', flexWrap: 'wrap' }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
            <input
              type="text"
              placeholder="Search by name, email, or student ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '2.5rem' }}
            />
            <Search
              size={18}
              color="var(--text-muted)"
              style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }}
            />
          </div>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="form-select"
            style={{ width: 'auto', fontSize: '0.875rem' }}
          >
            <option value="all">All Roles</option>
            <option value="student">Students Only</option>
            <option value="tutor">Tutors Only</option>
          </select>

          {/* Faculty Filter */}
          <select
            value={facultyFilter}
            onChange={(e) => setFacultyFilter(e.target.value)}
            className="form-select"
            style={{ width: 'auto', fontSize: '0.875rem' }}
          >
            <option value="all">All Faculties</option>
            <option value="Faculty of Computing & Technology">Computing & Tech (FCT)</option>
            <option value="Faculty of Science">Science (FOS)</option>
            <option value="Faculty of Commerce & Management">Commerce & Mgmt (FCMS)</option>
            <option value="Faculty of Humanities">Humanities (FOH)</option>
            <option value="Faculty of Social Sciences">Social Sciences (FSS)</option>
            <option value="Faculty of Medicine">Medicine (FOM)</option>
          </select>
        </div>

        <button
          onClick={fetchUsers}
          className="btn btn-outline"
          title="Refresh table"
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Users Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-secondary)' }}>
            Loading user directory...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-secondary)' }}>
            <Users size={44} color="var(--primary)" style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
            <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
              No Users Found
            </h3>
            <p style={{ fontSize: '0.875rem', maxWidth: '380px', margin: '0 auto' }}>
              No accounts match the selected filter criteria.
            </p>
          </div>
        ) : (
          <div className="table-container" style={{ border: 'none', borderRadius: 0, boxShadow: 'none' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>User Details</th>
                  <th>ID Number</th>
                  <th>Role</th>
                  <th>Faculty Affiliation</th>
                  <th>Account Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div
                          style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: '50%',
                            background: u.role === 'tutor' ? 'var(--secondary-subtle)' : 'var(--primary-subtle)',
                            color: u.role === 'tutor' ? 'var(--secondary-dark)' : 'var(--primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '0.85rem',
                          }}
                        >
                          {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{u.name}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <code style={{ background: 'var(--bg-main)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.85rem', color: 'var(--primary)' }}>
                        {u.userId}
                      </code>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          u.role === 'tutor' ? 'badge-primary' : 'badge-info'
                        }`}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        {u.role === 'tutor' ? <GraduationCap size={12} /> : <BookOpen size={12} />}
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                        {u.faculty}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-success">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Admin Modal */}
      {isAdminModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsAdminModalOpen(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '440px' }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid var(--border-color)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'var(--primary)',
                color: '#FFFFFF',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={18} />
                <h3 style={{ fontSize: '1.1rem', color: '#FFFFFF' }}>Create Administrator Account</h3>
              </div>
              <button
                onClick={() => setIsAdminModalOpen(false)}
                style={{ color: '#FAF9F6', padding: '4px', borderRadius: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '1.5rem' }}>
              <form onSubmit={handleCreateAdmin}>
                <div className="form-group">
                  <label className="form-label" htmlFor="admin-email">
                    Admin Email Address:
                  </label>
                  <input
                    id="admin-email"
                    type="email"
                    required
                    placeholder="e.g. dean-admin@kln.ac.lk"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="admin-password">
                    Password:
                  </label>
                  <input
                    id="admin-password"
                    type="password"
                    required
                    placeholder="Secure password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setIsAdminModalOpen(false)}
                    className="btn btn-outline"
                    style={{ flex: 1 }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creatingAdmin}
                    className="btn btn-primary"
                    style={{ flex: 2 }}
                  >
                    {creatingAdmin ? 'Creating...' : 'Register Administrator'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserDirectory;
