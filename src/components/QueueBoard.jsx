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
  const [rows, setRows] = useState([]); // array of rows, each row = [cellA, cellB] where cell = { name, orderId } or null
  const ordersRef = useRef([]); // keep current raw orders for easy updates
  const MIN_ROWS = 4; // show at least 4 rows as placeholders (you can change)

  // --- helper: format date/time ---
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const formatted =
        now.toLocaleDateString("en-GB").replace(/\//g, ".") +
        " " +
        now.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        });
      setDateTime(formatted);
    };
    updateDateTime();
    const t = setInterval(updateDateTime, 1000);
    return () => clearInterval(t);
  }, []);

  // --- helper: chunk an array into rows of 2 items each ---
  function chunkIntoPairs(arr) {
    const pairs = [];
    for (let i = 0; i < arr.length; i += 2) {
      pairs.push([arr[i] ?? null, arr[i + 1] ?? null]);
    }
    return pairs;
  }

  // --- convert full orders array to the `rows` structure we render ---
  function updateRowsFromOrders(rawOrders) {
    // filter only pending orders (queue). Change this if you want a different filter.
    const pending = rawOrders.filter((o) => String(o.status).toLowerCase() === "pending");

    // sort oldest -> newest (queue order)
    pending.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    // map to simple objects used in UI (name + orderId)
    const mapped = pending.map((o) => ({
      name: o.name ?? "",
      orderId: o.orderId ?? "",
      _id: o._id ?? null,
    }));

    const chunked = chunkIntoPairs(mapped);

    // ensure at least MIN_ROWS rows for visual parity with screenshot
    const fillCount = Math.max(0, MIN_ROWS - chunked.length);
    for (let i = 0; i < fillCount; i++) chunked.push([null, null]);

    setRows(chunked);
    ordersRef.current = pending; // keep reference to raw pending orders
  }

  // --- fetch initial data ---
  async function fetchOrders() {
    try {
      const res = await axios.get(API_URL);
      // detect common shapes: array, { data: [...] }, { orders: [...] }
      let dataArr = [];
      if (Array.isArray(res.data)) dataArr = res.data;
      else if (Array.isArray(res.data.data)) dataArr = res.data.data;
      else if (Array.isArray(res.data.orders)) dataArr = res.data.orders;
      else dataArr = [];

      updateRowsFromOrders(dataArr);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      // keep rows as placeholders
      updateRowsFromOrders([]);
    }
  }

  // --- socket listeners for realtime updates ---
  useEffect(() => {
    fetchOrders();

    // newOrder: backend may emit a single order object or an array
    function onNewOrder(payload) {
      if (!payload) return;
      if (Array.isArray(payload)) {
        // backend sent full list
        updateRowsFromOrders(payload);
        return;
      }
      const order = payload;
      // if it's completed already ignore, otherwise append to the end of the queue
      if (String(order.status).toLowerCase() !== "complete") {
        ordersRef.current = [...ordersRef.current, order];
        updateRowsFromOrders(ordersRef.current);
      }
    }

    // orderUpdated: update single order or full list
    function onOrderUpdated(payload) {
      if (!payload) return;
      if (Array.isArray(payload)) {
        updateRowsFromOrders(payload);
        return;
      }
      const updated = payload;
      const id = updated._id;
      if (!id) {
        // fallback: refresh full list
        fetchOrders();
        return;
      }

      // if order marked complete -> remove from queue
      if (String(updated.status).toLowerCase() === "complete") {
        ordersRef.current = ordersRef.current.filter((o) => o._id !== id);
        updateRowsFromOrders(ordersRef.current);
      } else {
        // replace or add
        let found = false;
        ordersRef.current = ordersRef.current.map((o) => {
          if (o._id === id) {
            found = true;
            return updated;
          }
          return o;
        });
        if (!found) ordersRef.current.push(updated);
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
  }, []);

  // --- rendering ---
  return (
    <div style={{ fontFamily: "'Times New Roman', serif", backgroundColor: "#fff" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 20px",
          borderBottom: "1px solid black",
          backgroundColor: "#fff",
        }}
      >
        <img src={LOGO_URL} alt="Logo" style={{ height: "50px" }} />

        <div style={{ textAlign: "center" }}>
          <div style={{ fontWeight: "bold", fontSize: "24px" }}>Default (Only Queue)</div>
          <div style={{ fontWeight: "bold", fontSize: "24px" }}>Premium</div>
        </div>

        <div style={{ fontSize: "18px" }}>{dateTime}</div>
      </div>

      {/* Table */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          tableLayout: "fixed",
          backgroundColor: "#fff",
        }}
      >
        <tbody>
          {rows.map((row, rowIndex) => {
            const isBottomRow = rowIndex === rows.length - 1;
            return (
              <tr
                key={rowIndex}
                style={{
                  backgroundColor: isBottomRow ? "#e9f0f8" : "#fff",
                }}
              >
                {row.map((cell, colIndex) => (
                  <td
                    key={colIndex}
                    style={{
                      border: "1px solid black",
                      height: "120px",
                      verticalAlign: "middle",
                      textAlign: "left",
                      position: "relative",
                      padding: "10px 20px",
                      backgroundColor: isBottomRow ? "#e9f0f8" : "#fff",
                    }}
                  >
                    {/* Name (left) and OrderID (right) on the same line */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 20, fontWeight: 600 }}>
                      <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {cell ? cell.name : ""}
                      </div>
                      <div style={{ marginLeft: 12 }}> {cell ? `#${cell.orderId}` : ""} </div>
                    </div>

                    {/* small description line (optional) */}
                    {/* <div style={{ fontSize: 12, color: "#666", marginTop: 6 }}>{cell ? cell.email : ""}</div> */}

                    {/* Brown bar (right half style like screenshot) */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        height: 6,
                        backgroundColor: "#8b5e3c",
                        width: "35%",
                      }}
                    />
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
