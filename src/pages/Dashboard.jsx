import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DashboardForm from "../components/DashboardForm";
import UserOrder from "../components/UserOrder";
import OrderList from "../components/OrderList";
import ChangeOrderStatus from "../components/ChangeOrderStatus";
// import OrderList from "../components/OrderList";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [usersList, setUsersList] = useState([]); // for admin
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddNewModelOpen, setIsAddNewModelOpen] = useState(false);
  // const [isorderListOpen, setIsOrderListOpen] = useState(false);/

  useEffect(() => {
    const fetchUser = async () => {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      if (!userId || !token) {
        console.error("User ID or Token missing");
        return;
      }

      try {
        const res = await axios.get(
          `http://localhost:5000/api/auth/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUser(res.data.user);

        // If admin, fetch all users
        if (res.data.user.role === "admin") {
          const allUsersRes = await axios.get(
            "http://localhost:5000/api/admin/users",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          // console.log(allUsersRes.data.data)
          setUsersList(allUsersRes.data.data || []);
        }

        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch user or users list:", err);
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-gray-700 dark:text-gray-300 text-xl">Loading...</p>
      </div>
    );
  }

  if (!user) return null;

  const handleViewUser = async (userId) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/admin/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // console.log("View API Response:", res.data.data); // <-- log it

      const userData = res.data.data;

      if (userData) {
        setSelectedUser(userData);
        setIsViewModalOpen(true);
      } else {
        console.error("User data not found in response");
      }
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/admin/user/${selectedUser._id}`,
        selectedUser,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      setIsEditModalOpen(false);
      // Refresh list after update
      const allUsersRes = await axios.get(
        "http://localhost:5000/api/admin/users",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setUsersList(allUsersRes.data.data || []);
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };

  // const isAddNewModelOpenFun ={
  //   setIsAddNewModelOpen(true)
  // }

    const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/logout");

      // Remove token if stored in localStorage
      localStorage.removeItem("token");

      // Navigate to login page
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-10 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
         <div className="flex flex-col md:flex-row justify-between items-center mb-6 p-4 bg-white dark:bg-gray-800 shadow rounded-lg">
  <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-4 md:mb-0">
    Welcome, {user.name}!
  </h1>
  <button
    onClick={handleLogout}
    className="bg-red-600 hover:bg-red-700 text-white font-medium px-5 py-2 rounded-xl shadow transition duration-200"
  >
    Logout
  </button>
</div>

          <p className="text-lg text-gray-600 dark:text-gray-300">
            Role: <span className="capitalize font-semibold">{user.role}</span>
          </p>
        </div>

        {/* Conditional Rendering */}
        {user.role === "customer" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold text-gray-700 dark:text-white mb-2">
                Profile Overview
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Email: {user.email}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Member since: {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm">
             
              <div className="list-disc ml-5 text-gray-600 dark:text-gray-300 space-y-1">
                <UserOrder  />

              </div>
            </div>
            <OrderList/>
            
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mt-6">
           <div className="flex items-center justify-between mb-6">
  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
    All Users order
  </h2>
  
  <button
    onClick={() => setIsAddNewModelOpen(true)}
    className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold px-5 py-2 rounded-full shadow-lg transition-all duration-200"
  >
    <span className="text-xl">＋</span> Add User
  </button>
</div>
<div>
  <ChangeOrderStatus/>
</div>


=====================================================================================================================
            {/* <div className="overflow-x-auto">
              <table className="min-w-full table-auto border border-gray-300 dark:border-gray-700">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                      Name
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                      Email
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                      Role
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.map((u) => (
                    <tr
                      key={u._id}
                      className="border-t border-gray-200 dark:border-gray-700"
                    >
                      <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-200">
                        {u.name}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-200">
                        {u.email}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-200 capitalize">
                        {u.role}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        <button
                          onClick={() => handleViewUser(u._id)}
                          className="bg-blue-500 text-white px-3 py-1 rounded mr-2 hover:bg-blue-600"
                        >
                          View
                        </button>

                        <button
                          onClick={() => {
                            setSelectedUser(u);
                            setIsEditModalOpen(true);
                          }}
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div> */}

=====================================================================================================================            
          </div>
        )}
      </div>
      {isViewModalOpen && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl w-full max-w-md border border-gray-300 dark:border-gray-700">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
              👤 User Details
            </h2>

            <div className="space-y-2 text-gray-700 dark:text-gray-300">
              <p>
                <span className="font-medium text-gray-900 dark:text-white">
                  Name:
                </span>{" "}
                {selectedUser.name || "N/A"}
              </p>
              <p>
                <span className="font-medium text-gray-900 dark:text-white">
                  Email:
                </span>{" "}
                {selectedUser.email || "N/A"}
              </p>
              <p>
                <span className="font-medium text-gray-900 dark:text-white">
                  Role:
                </span>{" "}
                <span className="capitalize">{selectedUser.role || "N/A"}</span>
              </p>
              <p>
                <span className="font-medium text-gray-900 dark:text-white">
                  Joined:
                </span>{" "}
                {selectedUser.createdAt
                  ? new Date(selectedUser.createdAt).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>

            <div className="mt-6 text-right">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-lg transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditModalOpen && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
              Edit User
            </h2>
            <form onSubmit={handleEditUser} className="space-y-4">
              <input
                type="text"
                value={selectedUser.name}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, name: e.target.value })
                }
                className="w-full px-3 py-2 border rounded"
                placeholder="Name"
              />
              <input
                type="email"
                value={selectedUser.email}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, email: e.target.value })
                }
                className="w-full px-3 py-2 border rounded"
                placeholder="Email"
              />
              <select
                value={selectedUser.role}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, role: e.target.value })
                }
                className="w-full px-3 py-2 border rounded"
              >
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
              </select>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isAddNewModelOpen && (
<div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
  <div className="relative bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
    <button
      onClick={() => {
        setIsAddNewModelOpen(false);
        // window.location.reload();
      }}
      className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full hover:bg-red-600 shadow-md text-sm"
    >
      ✕
    </button>
    <DashboardForm setShowAddUserForm={setIsAddNewModelOpen} />

  </div>
</div>

  
)}


    </div>
  );
}
