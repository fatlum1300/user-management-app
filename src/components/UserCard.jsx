import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { deleteUser } from "../store/usersSlice";

function getInitials(name) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export default function UserCard({ user, onEdit }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Delete ${user.name}?`)) {
      dispatch(deleteUser(user.id));
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(user);
  };

  return (
    <div className="user-card" onClick={() => navigate(`/user/${user.id}`)}>
      <div className="user-card-header">
        <div className="user-avatar">{getInitials(user.name)}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="user-card-name">{user.name}</div>
          <div className="user-card-company">{user.company?.name}</div>
        </div>
        {user.isLocal && <span className="badge-local">● Local</span>}
      </div>

      <div className="user-card-email">
        <span>✉</span>
        <span>{user.email}</span>
      </div>

      <div className="user-card-actions">
        <button className="btn btn-ghost btn-sm" onClick={handleEdit}>
          ✏ Edit
        </button>
        <button className="btn btn-danger btn-sm" onClick={handleDelete}>
          ✕ Delete
        </button>
        <button
          className="btn btn-ghost btn-sm"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/user/${user.id}`);
          }}
          style={{ marginLeft: "auto" }}
        >
          View →
        </button>
      </div>
    </div>
  );
}
