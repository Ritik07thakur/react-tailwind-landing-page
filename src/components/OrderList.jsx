import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // Update URL if needed

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch orders from API
  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/user/showOrder");
      const data = await res.json();
      if (data.success) {
        // Filter out completed orders and sort by orderId ascending
        const filteredSorted = data.data
          .filter(order => order.status !== "complete")
          .sort((a, b) => Number(a.orderId) - Number(b.orderId));
        setOrders(filteredSorted);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    // Listen for new orders and updates in real-time
    socket.on("newOrder", (newOrder) => {
      if (newOrder.status !== "complete") {
        setOrders((prev) => {
          // Add new order, filter completed, and sort ascending by orderId
          const updated = [...prev, newOrder].filter(order => order.status !== "complete");
          return updated.sort((a, b) => Number(a.orderId) - Number(b.orderId));
        });
      }
    });

    socket.on("orderUpdated", (updatedOrder) => {
      setOrders((prev) => {
        // Replace updated order if not complete, else remove it
        let updated = prev.filter(order => order._id !== updatedOrder._id);
        if (updatedOrder.status !== "complete") {
          updated.push(updatedOrder);
        }
        return updated.sort((a, b) => Number(a.orderId) - Number(b.orderId));
      });
    });

    // Cleanup listeners on unmount
    return () => {
      socket.off("newOrder");
      socket.off("orderUpdated");
    };
  }, []);

  if (loading) {
    return <p className="text-center py-4 text-white">Loading orders...</p>;
  }

  return (
    <div className="p-6 mx-auto max-w-6xl">
      <h2 className="text-xl font-bold mb-4 text-white">Pending Orders List</h2>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border border-gray-700 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-800 text-white text-sm">
              <th className="py-3 px-4 border-b border-gray-700 text-center w-1/6">
                Order ID
              </th>
              <th className="py-3 px-4 border-b border-gray-700 text-left w-1/6">
                Name
              </th>
              <th className="py-3 px-4 border-b border-gray-700 text-left w-1/6">
                Email
              </th>
              <th className="py-3 px-4 border-b border-gray-700 text-left w-1/6">
                Food
              </th>
              <th className="py-3 px-4 border-b border-gray-700 text-center w-1/6">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr
                  key={order._id}
                  className="hover:bg-gray-800 transition duration-200 text-sm"
                >
                  <td className="py-3 px-4 border-b border-gray-700 text-center text-gray-300">
                    {order.orderId}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-700 text-left text-gray-300">
                    {order.name}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-700 text-left text-gray-300">
                    {order.email}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-700 text-left text-gray-300">
                    {order.food}
                  </td>
                  <td className="py-3 px-4 border-b border-gray-700 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.status === "pending"
                          ? "bg-yellow-500 text-black"
                          : "bg-green-500 text-white"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="py-3 px-4 text-center text-gray-400 border-b border-gray-700"
                >
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
