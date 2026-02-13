import React, { useState } from "react";

const AthleteLogin = () => {
    const [token, setToken] = useState("");
    const [message, setMessage] = useState("");

    const handleLogin = () => {
        if (!token) {
            setMessage("Enter token");
            return;
        }

        localStorage.setItem("mazeToken", token);
        setMessage("Login successful! You can now scan the START QR.");
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
