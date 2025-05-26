import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./css/signup.css";
function Signup() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("temp"));

  const [form, setForm] = useState({
    id: "",
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
    const keys = name.split(".");

    setForm((prev) => {
      const updatedForm = { ...prev };

      if (keys.length === 3) {
        const [key1, key2, key3] = keys;
        updatedForm[key1] = {
          ...prev[key1],
          [key2]: {
            ...prev[key1][key2],
            [key3]: value,
          },
        };
      } else if (keys.length === 2) {
        const [key1, key2] = keys;
        updatedForm[key1] = {
          ...prev[key1],
          [key2]: value,
        };
      } else {
        updatedForm[name] = value;
      }

      return updatedForm;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userRes = await fetch("http://localhost:3000/users");
      const users = await userRes.json();

      const updatedForm = { ...form, id: (Number(users[users.length - 1].id) + 1).toString() };

      const postRes = await fetch(
        "http://localhost:3000/users",
        {
          method: "POST",
          body: JSON.stringify(updatedForm),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }
      );

      const postResult = await postRes.json();
      console.log("Created:", postResult);
      localStorage.setItem("currentUser", JSON.stringify(postResult));
      navigate(`/home/users/${postResult.id}`);
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
        <label>Geo Longitude</label>
        <input
          name="address.geo.lat"
          value={form.address.geo.lat}
          onChange={handleChange}
        />

        <label>Geo Longitude</label>
        <input
          name="address.geo.lng"
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
