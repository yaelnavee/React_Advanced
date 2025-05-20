import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./css/signup.css";
function Signup() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("temp"));

  const [form, setForm] = useState({
    id: 0,
    name: "",
    username: user.username,
    email: "",
    phone: "",
    website: user.password,
    address: {
      street: "",
      suite: "",
      city: "",
      zipcode: "",
      geo: {
        lat: "",
        lng: "",
      },
    },
    company: {
      name: "",
      catchPhrase: "",
      bs: "",
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle nested fields
    if (name.includes(".")) {
      const keys = name.split(".");
      setForm((prev) => ({
        ...prev,
        [keys[0]]: {
          ...prev[keys[0]],
          [keys[1]]: value,
        },
      }));
    } else if (name.includes("geo.")) {
      const [, key] = name.split(".");
      setForm((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          geo: {
            ...prev.address.geo,
            [key]: value,
          },
        },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const userRes = await fetch('https://jsonplaceholder.typicode.com/users');
    const users = await userRes.json();

    const updatedForm = { ...form, id: users.length + 1 };

    const postRes = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      body: JSON.stringify(updatedForm),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

    const postResult = await postRes.json();
    console.log("Created:", postResult);
    navigate("/home");
    
  } catch (err) {
    console.error("Submission error:", err);
  }
};


  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Signup</h2>

        <label>Name</label>
        <input name="name" value={form.name} onChange={handleChange} required />

        <label>Username</label>
        <input
          name="username"
          value={form.username}
          onChange={handleChange}
          required
        />

        <label>Email</label>
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <label>Phone</label>
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          required
        />

        <label>Website</label>
        <input
          name="website"
          value={form.website}
          onChange={handleChange}
          required
        />

        <h3>Address</h3>
        <label>Street</label>
        <input
          name="address.street"
          value={form.address.street}
          onChange={handleChange}
        />

        <label>Suite</label>
        <input
          name="address.suite"
          value={form.address.suite}
          onChange={handleChange}
        />

        <label>City</label>
        <input
          name="address.city"
          value={form.address.city}
          onChange={handleChange}
        />

        <label>Zipcode</label>
        <input
          name="address.zipcode"
          value={form.address.zipcode}
          onChange={handleChange}
        />

        <label>Geo Latitude</label>
        <input
          name="geo.lat"
          value={form.address.geo.lat}
          onChange={handleChange}
        />

        <label>Geo Longitude</label>
        <input
          name="geo.lng"
          value={form.address.geo.lng}
          onChange={handleChange}
        />

        <h3>Company</h3>
        <label>Company Name</label>
        <input
          name="company.name"
          value={form.company.name}
          onChange={handleChange}
        />

        <label>Catch Phrase</label>
        <input
          name="company.catchPhrase"
          value={form.company.catchPhrase}
          onChange={handleChange}
        />

        <label>BS</label>
        <input
          name="company.bs"
          value={form.company.bs}
          onChange={handleChange}
        />

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default Signup;
