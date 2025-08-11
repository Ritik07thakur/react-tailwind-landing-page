import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // change URL if needed

export default function ChangeOrderStatus() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/user/showOrder");
      const data = await res.json();
      if (data.success) {
        // only store pending orders in state
        const pendingOrders = data.data.filter(order => order.status === "pending");
        setOrders(pendingOrders);
        setFilteredOrders(pendingOrders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/user/order/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "complete" }),
      });

      const data = await res.json();

      if (data.status === "success") {
        // Remove from list immediately (optimistic UI update)
        setOrders((prev) => prev.filter((order) => order._id !== id));
        setFilteredOrders((prev) => prev.filter((order) => order._id !== id));
      }
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  useEffect(() => {
    fetchOrders();

    // Listen for new order events
    socket.on("newOrder", (newOrder) => {
      if (newOrder.status === "pending") {
        setOrders((prev) => [newOrder, ...prev]);
      }
    });

    // Listen for order updated events (remove completed orders)
    socket.on("orderUpdated", (updatedOrder) => {
      if (updatedOrder.status === "complete") {
        setOrders((prev) => prev.filter((order) => order._id !== updatedOrder._id));
      } else {
        setOrders((prev) =>
          prev.map((order) =>
            order._id === updatedOrder._id ? updatedOrder : order
          )
        );
      }
    });

    return () => {
      socket.off("newOrder");
      socket.off("orderUpdated");
    };
  }, []);

  // Filter orders when search query or orders change
  useEffect(() => {
    if (!searchQuery) {
      setFilteredOrders(orders);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = orders.filter((order) =>
        order.orderId.toString().toLowerCase().includes(query) ||
        order.name.toLowerCase().includes(query) ||
        order.email.toLowerCase().includes(query) ||
        order.food.toLowerCase().includes(query)
      );
      setFilteredOrders(filtered);
    }
  }, [searchQuery, orders]);

  if (loading) {
    return <p className="text-center text-gray-300">Loading...</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-white mb-4">Orders List</h2>

      {/* Search input */}
      <input
        type="text"
        placeholder="Search by Order ID, Name, Email or Food"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4 w-full p-2 rounded border border-gray-700 bg-gray-800 text-white"
      />

      <div className="overflow-x-auto">
        <table className="min-w-full rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-800 text-white text-left">
              <th className="py-3 px-6">Order ID</th>
              <th className="py-3 px-6">Name</th>
              <th className="py-3 px-6">Email</th>
              <th className="py-3 px-6">Food</th>
              <th className="py-3 px-6">Status</th>
              <th className="py-3 px-6 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="bg-gray-900 text-white">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr key={order._id} className="border-b border-gray-700">
                  <td className="py-3 px-6">{order.orderId}</td>
                  <td className="py-3 px-6">{order.name}</td>
                  <td className="py-3 px-6">{order.email}</td>
                  <td className="py-3 px-6">{order.food}</td>
                  <td className="py-3 px-6">
                    <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-semibold">
                      Pending
                    </span>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <button
                      onClick={() => handleStatusChange(order._id)}
                      className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out"
                    >
                      Complete Now
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-400">
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
