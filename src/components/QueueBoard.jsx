// src/components/QueueBoard.jsx
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const API_URL = "http://localhost:5000/api/user/showOrder";
const SOCKET_URL = "http://localhost:5000";
const LOGO_URL = "https://developer.qwaiting.com/images/logo/1753942008.png";

const socket = io(SOCKET_URL, { autoConnect: true });

export default function QueueBoard() {
  const [dateTime, setDateTime] = useState("");
  const [rows, setRows] = useState([]);
  const ordersRef = useRef([]);
  const MIN_ROWS = 4;

  // SOUND ENABLED state (persist to localStorage)
  const [soundEnabled, setSoundEnabled] = useState(() => {
    try { return localStorage.getItem("queue_sound_enabled") === "1"; } catch { return false; }
  });

  // --- Date/time ---
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const formatted =
        now.toLocaleDateString("en-GB").replace(/\//g, ".") +
        " " +
        now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
      setDateTime(formatted);
    };
    updateDateTime();
    const t = setInterval(updateDateTime, 1000);
    return () => clearInterval(t);
  }, []);

  // --- Utilities: chunk orders into pairs (two-per-row) ---
  function chunkIntoPairs(arr) {
    const pairs = [];
    for (let i = 0; i < arr.length; i += 2) {
      pairs.push([arr[i] ?? null, arr[i + 1] ?? null]);
    }
    return pairs;
  }

  function updateRowsFromOrders(rawOrders) {
    const pending = rawOrders.filter((o) => String(o.status).toLowerCase() === "pending");
    pending.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    const mapped = pending.map((o) => ({ name: o.name ?? "", orderId: o.orderId ?? "", _id: o._id ?? null }));
    const chunked = chunkIntoPairs(mapped);
    const fillCount = Math.max(0, MIN_ROWS - chunked.length);
    for (let i = 0; i < fillCount; i++) chunked.push([null, null]);
    setRows(chunked);
    ordersRef.current = pending;
  }

  // --- Fetch initial orders ---
  async function fetchOrders() {
    try {
      const res = await axios.get(API_URL);
      let dataArr = [];
      if (Array.isArray(res.data)) dataArr = res.data;
      else if (Array.isArray(res.data.data)) dataArr = res.data.data;
      else if (Array.isArray(res.data.orders)) dataArr = res.data.orders;
      else dataArr = [];
      updateRowsFromOrders(dataArr);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      updateRowsFromOrders([]);
    }
  }

  // --- Audio helpers ---
  // play an audio file and wait until it ends (resolves), or reject if can't play
  function playAudioAndWait(src) {
    return new Promise((resolve, reject) => {
      try {
        const audio = new Audio(src);
        // ensure cleanup handlers
        const cleanup = () => {
          audio.onended = null;
          audio.onerror = null;
        };
        audio.onended = () => { cleanup(); resolve(); };
        audio.onerror = (e) => { cleanup(); reject(e); };
        const p = audio.play();
        // if browser returns a promise, handle rejection
        if (p && typeof p.then === "function") {
          p.catch((err) => {
            // reject if playback not allowed
            cleanup();
            reject(err);
          });
        }
      } catch (err) {
        reject(err);
      }
    });
  }

  // speak message via SpeechSynthesis
  function speakQueueNumber(orderId) {
    try {
      const text = `Your queue number ${orderId} will be called soon`;
      const u = new SpeechSynthesisUtterance(text);
      // optional: pick preferred voice (english)
      const voices = window.speechSynthesis.getVoices();
      // pick first en voice if found
      const v = voices.find((vv) => vv.lang && vv.lang.startsWith("en")) || voices[0];
      if (v) u.voice = v;
      u.rate = 1;
      u.pitch = 1;
      // cancel any existing spoken text to avoid overlap
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    } catch (err) {
      console.error("Speech failed:", err);
    }
  }

  // Play ding then speak (safe fallback: if ding fails try speaking anyway)
  async function playDingThenSpeak(orderId) {
    if (!soundEnabled) return;
    try {
      await playAudioAndWait("/dingdong.mp3");
      // small delay (optional)
      setTimeout(() => speakQueueNumber(orderId), 200);
    } catch (err) {
      console.warn("Ding playback failed, fallback to speak only:", err);
      speakQueueNumber(orderId);
    }
  }

  // --- Socket listeners ---
  useEffect(() => {
    fetchOrders();

    function onNewOrder(payload) {
      if (!payload) return;
      // if array -> full list
      if (Array.isArray(payload)) {
        updateRowsFromOrders(payload);
        return;
      }
      const order = payload;
      // treat only pending as queue additions
      if (String(order.status).toLowerCase() !== "complete") {
        ordersRef.current = [...ordersRef.current, order];
        updateRowsFromOrders(ordersRef.current);
        // play sound + speak
        playDingThenSpeak(order.orderId);
      }
    }

    function onOrderUpdated(payload) {
      if (!payload) return;
      if (Array.isArray(payload)) {
        updateRowsFromOrders(payload);
        return;
      }
      const updated = payload;
      const id = updated._id;
      if (!id) { fetchOrders(); return; }
      // if completed remove
      if (String(updated.status).toLowerCase() === "complete") {
        ordersRef.current = ordersRef.current.filter((o) => o._id !== id);
        updateRowsFromOrders(ordersRef.current);
      } else {
        // replace or add and optionally play sound if it's a newly added pending item
        let found = false;
        ordersRef.current = ordersRef.current.map((o) => {
          if (o._id === id) { found = true; return updated; }
          return o;
        });
        if (!found) {
          ordersRef.current.push(updated);
          // play sound for newly added via update (if appropriate)
          playDingThenSpeak(updated.orderId);
        }
        updateRowsFromOrders(ordersRef.current);
      }
    }

    socket.on("newOrder", onNewOrder);
    socket.on("orderUpdated", onOrderUpdated);

    return () => {
      socket.off("newOrder", onNewOrder);
      socket.off("orderUpdated", onOrderUpdated);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [soundEnabled]);

  // --- UI: enable sound handler ---
  function enableSound() {
    try {
      // try to make a short sound to prime audio permission
      const a = new Audio("/dingdong.mp3");
      a.play().catch(() => { /* may still fail; user gesture required */ });
    } catch (err) {
      // ignore
    }
    setSoundEnabled(true);
    try { localStorage.setItem("queue_sound_enabled", "1"); } catch {}
  }

  // Render
  return (
    <div style={{ fontFamily: "'Times New Roman', serif", backgroundColor: "#fff" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 20px", borderBottom: "1px solid black", backgroundColor: "#fff" }}>
        <img src={LOGO_URL} alt="Logo" style={{ height: "50px" }} />
        <div style={{ textAlign: "center" }}>
          <div style={{ fontWeight: "bold", fontSize: "24px" }}>Default (Only Queue)</div>
          <div style={{ fontWeight: "bold", fontSize: "24px" }}>Premium</div>
        </div>
        <div style={{ fontSize: "18px" }}>{dateTime}</div>
      </div>

      {/* If sound not enabled show a small floating button/overlay to enable it */}
      {!soundEnabled && (
        <div style={{ position: "fixed", right: 20, bottom: 20, zIndex: 9999 }}>
          <button onClick={enableSound} style={{ padding: "10px 14px", borderRadius: 6, border: "1px solid #333", background: "#111", color: "#fff", cursor: "pointer" }}>
            Enable Sound
          </button>
        </div>
      )}

      {/* Table */}
      <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed", backgroundColor: "#fff" }}>
        <tbody>
          {rows.map((row, rowIndex) => {
            const isBottomRow = rowIndex === rows.length - 1;
            return (
              <tr key={rowIndex} style={{ backgroundColor: isBottomRow ? "#e9f0f8" : "#fff" }}>
                {row.map((cell, colIndex) => (
                  <td key={colIndex} style={{ border: "1px solid black", height: "120px", verticalAlign: "middle", textAlign: "left", position: "relative", padding: "10px 20px", backgroundColor: isBottomRow ? "#e9f0f8" : "#fff" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 20, fontWeight: 600 }}>
                      <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{cell ? cell.name : ""}</div>
                      <div style={{ marginLeft: 12 }}>{cell ? `#${cell.orderId}` : ""}</div>
                    </div>
                    <div style={{ position: "absolute", bottom: 0, right: 0, height: 6, backgroundColor: "#8b5e3c", width: "35%" }} />
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
