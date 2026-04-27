import { useEffect, useState } from "react";
import API from "../api/axios";
import UserCard from "../components/UserCard";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true); // 👈 important

  // 🔄 Fetch Users
  const fetchUsers = async (currentPage = page) => {
    try {
      setLoading(true);

      const res = await API.get(`/api/users?page=${currentPage}`);

      setUsers(res.data.users);

      // 🔥 detect next page
      setHasMore(res.data.users.length > 0);

      setPage(currentPage);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(1);
  }, []);

  // ✏️ Update Name
  const updateName = async (id, name) => {
    const [firstName, ...rest] = name.split(" ");
    const lastName = rest.join(" ");

    await API.put(`/api/users/${id}`, {
      firstName,
      lastName,
    });

    fetchUsers(page); // refresh current page
  };

  // 🔐 Update Password
  const updatePassword = async (id, password) => {
    await API.put(`/api/users/${id}/password`, {
      password,
    });
  };

  return (
    <div className="p-6">

      {/* 🔷 Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">
          Users
        </h1>

        <span className="text-sm bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
          Page {page}
        </span>
      </div>

      {/* ⏳ Loading */}
      {loading && (
        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-40 rounded-xl bg-white/60 animate-pulse"
            />
          ))}
        </div>
      )}

      {/* 👥 Users */}
      {!loading && users.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
          {users.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              updateName={updateName}
              updatePassword={updatePassword}
            />
          ))}
        </div>
      )}

      {/* 📭 Empty */}
      {!loading && users.length === 0 && (
        <div className="text-center mt-16">
          <p className="text-gray-500 text-lg">No users found</p>
        </div>
      )}

      {/* 📄 Pagination */}
      {!loading && (
        <div className="flex justify-center items-center gap-4 mt-8">

          {/* Prev */}
          <button
            onClick={() => fetchUsers(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span className="text-sm font-medium">
            Page {page}
          </span>

          {/* Next */}
          <button
            onClick={() => fetchUsers(page + 1)}
            disabled={!hasMore}
            className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50"
          >
            Next
          </button>

        </div>
      )}
    </div>
  );
}