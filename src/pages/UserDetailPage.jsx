import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function getInitials(name) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export default function UserDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useSelector((s) =>
    s.users.list.find((u) => String(u.id) === String(id))
  );

  if (!user) {
    return (
      <div className="state-container">
        <div className="state-icon">◌</div>
        <div className="state-title">User not found</div>
        <button className="btn btn-primary" onClick={() => navigate("/")}>
          Back to Users
        </button>
      </div>
    );
  }

  const addr = user.address || {};
  const fullAddress = [addr.street, addr.city, addr.zipcode]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="detail-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="detail-hero">
        <div className="detail-avatar">{getInitials(user.name)}</div>
        <div>
          <div className="detail-name">{user.name}</div>
          <div className="detail-username">@{user.username || user.name.toLowerCase().replace(/\s+/g, "")}</div>
          {user.isLocal && (
            <span className="badge-local" style={{ marginTop: 8 }}>● Local User</span>
          )}
        </div>
      </div>

      <div className="detail-grid">
        {/* Contact */}
        <div className="detail-card">
          <div className="detail-card-title">Contact</div>
          <div className="detail-row">
            <span className="detail-row-label">Email</span>
            <span className="detail-row-value">
              <a href={`mailto:${user.email}`}>{user.email}</a>
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-row-label">Phone</span>
            <span className="detail-row-value">{user.phone || "—"}</span>
          </div>
          <div className="detail-row">
            <span className="detail-row-label">Website</span>
            <span className="detail-row-value">
              {user.website ? (
                <a
                  href={
                    user.website.startsWith("http")
                      ? user.website
                      : `https://${user.website}`
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  {user.website}
                </a>
              ) : (
                "—"
              )}
            </span>
          </div>
        </div>

        {/* Company */}
        <div className="detail-card">
          <div className="detail-card-title">Company</div>
          <div className="detail-row">
            <span className="detail-row-label">Name</span>
            <span className="detail-row-value">{user.company?.name || "—"}</span>
          </div>
          <div className="detail-row">
            <span className="detail-row-label">Catchphrase</span>
            <span className="detail-row-value">
              {user.company?.catchPhrase || "—"}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-row-label">BS</span>
            <span className="detail-row-value">{user.company?.bs || "—"}</span>
          </div>
        </div>

        {/* Address */}
        <div className="detail-card" style={{ gridColumn: "1 / -1" }}>
          <div className="detail-card-title">Address</div>
          <div className="detail-row">
            <span className="detail-row-label">Street</span>
            <span className="detail-row-value">{addr.street || "—"}</span>
          </div>
          <div className="detail-row">
            <span className="detail-row-label">Suite</span>
            <span className="detail-row-value">{addr.suite || "—"}</span>
          </div>
          <div className="detail-row">
            <span className="detail-row-label">City</span>
            <span className="detail-row-value">{addr.city || "—"}</span>
          </div>
          <div className="detail-row">
            <span className="detail-row-label">ZIP</span>
            <span className="detail-row-value">{addr.zipcode || "—"}</span>
          </div>
          {addr.geo && (
            <div className="detail-row">
              <span className="detail-row-label">Geo</span>
              <span className="detail-row-value">
                {addr.geo.lat}, {addr.geo.lng}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
