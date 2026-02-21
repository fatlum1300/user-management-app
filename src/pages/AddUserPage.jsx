import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addUser } from "../store/usersSlice";

function validate(values) {
  const errors = {};
  if (!values.name.trim()) errors.name = "Name is required";
  else if (values.name.trim().length < 2) errors.name = "Name must be at least 2 characters";
  if (!values.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Enter a valid email address";
  }
  if (values.phone && !/^[+\d\s\-().]{6,20}$/.test(values.phone)) {
    errors.phone = "Enter a valid phone number";
  }
  return errors;
}

const INITIAL = {
  name: "", email: "", phone: "", website: "",
  company: "", street: "", city: "", zipcode: "",
};

export default function AddUserPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [values, setValues] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field) => (e) => {
    const val = e.target.value;
    setValues((prev) => ({ ...prev, [field]: val }));
    if (touched[field]) {
      setErrors(validate({ ...values, [field]: val }));
    }
  };

  const handleBlur = (field) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validate(values));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const allTouched = Object.keys(values).reduce((a, k) => ({ ...a, [k]: true }), {});
    setTouched(allTouched);
    const errs = validate(values);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    dispatch(addUser(values));
    setSubmitted(true);
    setTimeout(() => navigate("/"), 1200);
  };

  const F = (name, label, placeholder, required = false, type = "text") => (
    <div className="form-group">
      <label className="form-label">{label}{required && <span>*</span>}</label>
      <input
        type={type}
        className={`form-input ${errors[name] && touched[name] ? "error" : ""}`}
        placeholder={placeholder}
        value={values[name]}
        onChange={handleChange(name)}
        onBlur={handleBlur(name)}
      />
      {errors[name] && touched[name] && (
        <div className="form-error">⚠ {errors[name]}</div>
      )}
    </div>
  );

  if (submitted) {
    return (
      <div className="state-container">
        <div style={{ fontSize: 48 }}>✓</div>
        <div className="state-title" style={{ color: "var(--success)" }}>User Added!</div>
        <div className="state-desc">Redirecting to the user list…</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 560 }}>
      <div className="page-header">
        <h1>Add New User</h1>
        <p>Fill in the details below. Name and email are required.</p>
      </div>

      <div style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-xl)",
        padding: 32,
      }}>
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            {F("name", "Full Name", "John Doe", true)}
            {F("email", "Email Address", "john@example.com", true, "email")}
          </div>
          <div className="form-row">
            {F("phone", "Phone", "+1 555 000 0000")}
            {F("website", "Website", "johndoe.com")}
          </div>
          {F("company", "Company", "Acme Corp")}

          <div style={{ borderTop: "1px solid var(--border)", paddingTop: 18, marginBottom: 4 }}>
            <div className="form-label" style={{ marginBottom: 14 }}>
              Address <span style={{ color: "var(--text-3)", fontWeight: 400 }}>(optional)</span>
            </div>
            {F("street", "Street", "123 Main St")}
            <div className="form-row">
              {F("city", "City", "New York")}
              {F("zipcode", "ZIP Code", "10001")}
            </div>
          </div>

          <div className="form-footer" style={{ justifyContent: "space-between" }}>
            <button type="button" className="btn btn-ghost" onClick={() => navigate("/")}>
              ← Back to List
            </button>
            <button type="submit" className="btn btn-primary">
              + Add User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
