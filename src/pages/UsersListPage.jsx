import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  selectFilteredSortedUsers,
  setSearchQuery,
  setSortConfig,
} from "../store/usersSlice";
import UserCard from "../components/UserCard";
import AddEditUserModal from "../components/AddEditUserModal";

const SORT_OPTIONS = [
  { value: "name-asc", label: "Name A→Z" },
  { value: "name-desc", label: "Name Z→A" },
  { value: "email-asc", label: "Email A→Z" },
  { value: "email-desc", label: "Email Z→A" },
  { value: "company-asc", label: "Company A→Z" },
  { value: "company-desc", label: "Company Z→A" },
];

export default function UsersListPage() {
  const dispatch = useDispatch();
  const users = useSelector(selectFilteredSortedUsers);
  const status = useSelector((s) => s.users.status);
  const error = useSelector((s) => s.users.error);
  const searchQuery = useSelector((s) => s.users.searchQuery);
  const sortConfig = useSelector((s) => s.users.sortConfig);

  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchUsers());
    }
  }, [status, dispatch]);

  const handleSortChange = (e) => {
    const [field, direction] = e.target.value.split("-");
    dispatch(setSortConfig({ field, direction }));
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditUser(null);
  };

  const currentSortValue = `${sortConfig.field}-${sortConfig.direction}`;

  return (
    <div>
      <div className="page-header">
        <h1>Users</h1>
        <p>Manage and browse all users in the system.</p>
      </div>

      <div className="toolbar">
        <div className="search-wrapper">
          <span className="search-icon">⌕</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search by name or email…"
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          />
        </div>

        <select
          className="sort-select"
          value={currentSortValue}
          onChange={handleSortChange}
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        <button
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          + Add User
        </button>
      </div>

      {status === "loading" && (
        <div className="state-container">
          <div className="spinner" />
          <div className="state-title">Loading users…</div>
        </div>
      )}

      {status === "failed" && (
        <div className="state-container">
          <div className="state-icon">⚠</div>
          <div className="state-title">Failed to load users</div>
          <div className="state-desc">{error}</div>
          <button className="btn btn-primary" onClick={() => dispatch(fetchUsers())}>
            Retry
          </button>
        </div>
      )}

      {status === "succeeded" && (
        <>
          <div className="user-count">
            Showing <strong>{users.length}</strong>{" "}
            {users.length === 1 ? "user" : "users"}
            {searchQuery && ` for "${searchQuery}"`}
          </div>

          {users.length === 0 ? (
            <div className="state-container">
              <div className="state-icon">◌</div>
              <div className="state-title">No users found</div>
              <div className="state-desc">
                {searchQuery
                  ? "Try a different search term."
                  : "No users available yet."}
              </div>
            </div>
          ) : (
            <div className="users-grid">
              {users.map((user) => (
                <UserCard key={user.id} user={user} onEdit={handleEdit} />
              ))}
            </div>
          )}
        </>
      )}

      {showModal && (
        <AddEditUserModal
          onClose={handleCloseModal}
          editUser={editUser}
        />
      )}
    </div>
  );
}
