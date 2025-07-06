import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;

export default function Profile() {
  const [form, setForm] = useState({ name: "", email: "", picture: "", email_verified: "" });
  const [originalData, setOriginalData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  const updateSessionAndState = (user) => {
    const updated = {
      name: user.name || "",
      email: user.email || "",
      picture: user.picture || "",
      email_verified: user.email_verified?.toString() || "false",
    };
    setOriginalData(updated);
    setForm(updated);
    sessionStorage.setItem("dbUser", JSON.stringify(user));
  };

  useEffect(() => {
    const cached = sessionStorage.getItem("dbUser");
    if (cached) {
      const user = JSON.parse(cached);
      updateSessionAndState(user);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const isChanged = JSON.stringify(form) !== JSON.stringify(originalData);

  const handleSave = async () => {
    try {
      const sub = JSON.parse(sessionStorage.getItem("dbUser"))?.sub;
      if (!sub) return alert("User not found");

      const res = await fetch(`${API_URL}/api/users/me`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, sub })  // Send sub as-is (still a string)
      });

      const data = await res.json();
      if (!res.ok) return alert(data.error || "Failed to update profile");

      updateSessionAndState(data);
      setIsEditing(false);
      alert("Profile updated!");
    } catch (err) {
      console.error("Error updating profile", err);
      alert("Update failed");
    }
  };

  return (
    <div>
      <h2>Profile</h2>

      <div>
        <label>Name:</label>
        <input name="name" value={form.name} onChange={handleChange} disabled={!isEditing} />
      </div>
      <div>
        <label>Email:</label>
        <input name="email" value={form.email} onChange={handleChange} disabled={!isEditing} />
      </div>
      <div>
        <label>Email Verified:</label>
        <input name="email_verified" value={form.email_verified} onChange={handleChange} disabled={!isEditing} />
      </div>
      <div>
        <label>Picture URL:</label>
        <input name="picture" value={form.picture} onChange={handleChange} disabled={!isEditing} />
      </div>

      {!isEditing ? (
        <button onClick={() => setIsEditing(true)}>Edit</button>
      ) : (
        <>
          <button onClick={handleSave} disabled={!isChanged}>Save</button>
          <button onClick={() => {
            setForm(originalData);
            setIsEditing(false);
          }}>Cancel</button>
        </>
      )}
      <button onClick={() => navigate(-1)}>Back</button>
    </div>
  );
}
