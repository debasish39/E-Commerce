import { useState } from "react";

export default function UserCard({ user, updateName, updatePassword }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.name || "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!name.trim()) return alert("Name required");

    try {
      setLoading(true);

      await updateName(user.id, name);

      if (password.length >= 8) {
        await updatePassword(user.id, password);
      }

      setEditing(false);
      setPassword("");
    } catch (err) {
      console.error(err);
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl p-4 transition-all duration-300 
      bg-white/80 backdrop-blur-md shadow-md hover:shadow-xl hover:scale-[1.01] border border-white/40">

      {/* 👤 Header */}
      <div className="flex items-center gap-3">
        <img
          src={user.image || "https://via.placeholder.com/50"}
          className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500"
          alt=""
        />
        <div>
          <p className="font-semibold text-gray-800">{user.name}</p>
          <p className="text-xs text-gray-500">{user.id}</p>
        </div>
      </div>

      {/* 📧 Emails */}
      <div className="mt-3 text-xs text-gray-600 space-y-1">
        {user.emails?.length > 0 ? (
          user.emails.map((email, i) => (
            <p key={i} className="truncate">{email}</p>
          ))
        ) : (
          <p className="text-gray-400">No email</p>
        )}
      </div>

      {/* 📅 Info */}
      <div className="mt-3 text-xs text-gray-500">
        <p>Created: {user.createdAt || "N/A"}</p>
        <p>
          Last Login:{" "}
          {user.lastSignIn || (
            <span className="text-gray-400">Never</span>
          )}
        </p>
      </div>

      {/* ✏️ Edit Section */}
      {editing ? (
        <div className="mt-3 space-y-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 rounded text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="Name"
          />

          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 rounded text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <div className="flex gap-2">
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-1.5 rounded-md text-sm transition"
            >
              {loading ? "Saving..." : "Save"}
            </button>

            <button
              onClick={() => setEditing(false)}
              className="flex-1 bg-gray-200 hover:bg-gray-300 py-1.5 rounded-md text-sm transition"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setEditing(true)}
          className="mt-3 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-1.5 rounded-md text-sm transition"
        >
          Edit User
        </button>
      )}
    </div>
  );
}