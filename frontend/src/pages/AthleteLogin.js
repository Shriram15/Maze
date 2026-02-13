import React, { useState } from "react";
import API from "../api";

const AthleteLogin = () => {
    const [token, setToken] = useState("");
    const [message, setMessage] = useState("");

    const handleLogin = async () => {
        try {
            if (!token) {
                setMessage("Enter token");
                return;
            }

            const res = await API.post("/auth/login", { token });

            // 🔥 Save JWT (NOT raw token)
            localStorage.setItem("token", res.data.token);

            setMessage("Login successful! You can now scan.");

        } catch (error) {
            setMessage("Invalid token");
        }
    };

    return (
        <div style={{ textAlign: "center", marginTop: "100px" }}>
            <h2>Athlete Login</h2>

            <input
                type="text"
                placeholder="Enter your token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                style={{ padding: "8px", width: "300px" }}
            />

            <br /><br />

            <button onClick={handleLogin} style={{ padding: "8px 20px" }}>
                Login
            </button>

            <p>{message}</p>
        </div>
    );
};

export default AthleteLogin;
