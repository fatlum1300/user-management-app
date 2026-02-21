import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addUser, updateUser } from "../store/usersSlice";

const INITIAL = {
  name: "",
  email: "",
  phone: "",
  website: "",
  company: "",
  street: "",
  city: "",
  zipcode: "",
};

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

export default function AddEditUserModal({ onClose, editUser }) {
  const dispatch = useDispatch();
  const isEdit = Boolean(editUser);

  const [values, setValues] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (editUser) {
      setValues({
        name: editUser.name || "",
        email: editUser.email || "",
        phone: editUser.phone || "",
        website: editUser.website || "",
        company: editUser.company?.name || "",
        street: editUser.address?.street || "",
        city: editUser.address?.city || "",
        zipcode: editUser.address?.zipcode || "",
      });
    }
  }, [editUser]);

  const handleChange = (field) => (e) => {
    const val = e.target.value;
    setValues((prev) => ({ ...prev, [field]: val }));
    if (touched[field]) {
      setErrors((prev) => ({ ...prev, ...validate({ ...values, [field]: val }) }));
    }
  };

  const handleBlur = (field) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validate(values));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const allTouched = Object.keys(values).reduce((acc, k) => ({ ...acc, [k]: true }), {});
    setTouched(allTouched);
    const errs = validate(values);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    if (isEdit) {
      dispatch(
        updateUser({
          ...editUser,
          name: values.name,
          email: values.email,
          phone: values.phone,
          website: values.website,
          company: { ...editUser.company, name: values.company },
          address: {
            ...editUser.address,
            street: values.street,
            city: values.city,
            zipcode: values.zipcode,
          },
        })
      );
    } else {
      dispatch(addUser(values));
    }
    onClose();
  };

  const field = (name, label, placeholder, required = false, type = "text") => (
    <div className="form-group">
      <label className="form-label">
        {label} {required && <span>*</span>}
      </label>
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

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">{isEdit ? "Edit User" : "Add New User"}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            {field("name", "Full Name", "John Doe", true)}
            {field("email", "Email", "john@example.com", true, "email")}
          </div>

          <div className="form-row">
            {field("phone", "Phone", "+1 555 000 0000")}
            {field("website", "Website", "johndoe.com")}
          </div>

          {field("company", "Company", "Acme Corp")}

          <div style={{ borderTop: "1px solid var(--border)", paddingTop: 18, marginTop: 4 }}>
            <div className="form-label" style={{ marginBottom: 14 }}>
              Address <span style={{ color: "var(--text-3)", fontWeight: 400 }}>(optional)</span>
            </div>
            {field("street", "Street", "123 Main St")}
            <div className="form-row">
              {field("city", "City", "New York")}
              {field("zipcode", "ZIP Code", "10001")}
            </div>
          </div>

          <div className="form-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {isEdit ? "Save Changes" : "+ Add User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
