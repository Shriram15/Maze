import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import API from "../api";

const ScanHandler = () => {
  const { checkpointId } = useParams();
  const [message, setMessage] = useState("Processing...");
  const hasScanned = useRef(false); // 👈 prevents double execution

  useEffect(() => {
    if (hasScanned.current) return; // 👈 stop second execution
    hasScanned.current = true;

    const token = localStorage.getItem("mazeToken");

    if (!token) {
      setMessage("Please login first.");
      return;
    }

    const sendScan = async () => {
      try {
        const res = await API.post("/scan", {
          token,
          checkpointId: Number(checkpointId)
        });

        setMessage(res.data.message);
      } catch (error) {
        setMessage(
          error.response?.data?.message || "Scan failed"
        );
      }
    };

    sendScan();
  }, [checkpointId]);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>{message}</h2>
    </div>
  );
};

export default ScanHandler;
