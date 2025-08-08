import React, { useEffect, useState } from "react";

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch orders from API
  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/user/showOrder");
      const data = await res.json();
      if (data.success) {
        setOrders(data.data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // Update order status
  const updateStatus = async (orderId) => {
    try {
      await fetch(`http://localhost:5000/api/user/order/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "completed" }),
      });
      // Refresh orders after update
      fetchOrders();
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  useEffect(() => {
    fetchOrders();

    // Polling every 5 seconds
    const interval = setInterval(() => {
      fetchOrders();
    }, 5000);

    // Cleanup on unmount
    return () => clearInterval(interval);
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
                  key={order.orderId}
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
