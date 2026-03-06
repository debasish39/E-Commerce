import { useUser, SignOutButton } from "@clerk/clerk-react";
import { useState } from "react";
import { toast } from "sonner";
import { FaUserEdit, FaTrashAlt, FaSignOutAlt } from "react-icons/fa";
import Tilt from "react-parallax-tilt";

export default function ProfilePage() {
  const { user, isLoaded } = useUser();

  const [uploading, setUploading] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [fullName, setFullName] = useState("");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  if (!isLoaded) return null;

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      await user.setProfileImage({ file });
      toast.success("Profile image updated 🎉");
    } catch {
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    toast("Remove profile image?", {
      action: {
        label: "Confirm",
        onClick: async () => {
          try {
            setUploading(true);
            await user.setProfileImage({ file: null });
            toast.success("Profile image removed");
          } catch {
            toast.error("Failed to remove image");
          } finally {
            setUploading(false);
          }
        },
      },
    });
  };

  const handleUpdateName = async () => {
    if (!fullName.trim()) return;

    const names = fullName.split(" ");
    const firstName = names[0];
    const lastName = names.slice(1).join(" ");

    try {
      await user.update({ firstName, lastName });
      toast.success("Name updated ✨");
      setEditingName(false);
    } catch {
      toast.error("Failed to update name");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br = text-white flex justify-center px-4 py-9">

      <div className="w-full max-w-5xl">

        {/* COVER */}
<div className="h-48 w-full rounded-3xl 
bg-[conic-gradient(from_180deg_at_50%_50%,#ef4444,#dc2626,#fb7185,#ef4444)] 
animate-spinSlow relative shadow-xl">
          {/* AVATAR */}
          <div className="absolute -bottom-16 left-10">

            <div className="relative group">

              <div className="absolute -inset-2 rounded-full bg-gradient-to-tr from-red-500 via-red-400 to-black/30 blur-xl opacity-50"></div>

              <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} scale={1.05}>
                <img
                  src={user?.imageUrl}
                  alt="avatar"
                  className="relative h-32 w-32 rounded-full border-4 border-black object-cover shadow-2xl"
                />
              </Tilt>

              {/* Upload Overlay */}
              <label className="absolute inset-0 rounded-full flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 cursor-pointer transition">

                {uploading ? (
                  <span className="text-xs animate-pulse">Uploading...</span>
                ) : (
                  <span className="text-xs font-medium">Change</span>
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

              </label>

            </div>

          </div>

        </div>

        <div className="mt-20 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 shadow-xl">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between">

            <div className="max-w-md">

              {!editingName ? (
                <>
                  

  <div className="flex flex-col gap-4">

  
  <div className="flex items-center gap-3">

    <h1 className="text-3xl font-semibold tracking-tight
    bg-gradient-to-r from-red-400 via-pink-400 to-purple-400
    bg-clip-text text-transparent">
      {user?.fullName}
    </h1>

    <span className="flex items-center gap-1 text-xs text-green-400">
      <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
      Online
    </span>

  </div>

  <div className="text-gray-400 text-sm">
    {user?.primaryEmailAddress?.emailAddress}
  </div>

  <div>

    <button
      onClick={() => {
        setFullName(user?.fullName || "");
        setEditingName(true);
      }}
      className="group inline-flex items-center gap-2 px-4 py-2
      text-sm rounded-lg
      border border-white/10
      bg-white/5 backdrop-blur-md
      hover:bg-white/10 hover:border-white/20
      transition-all duration-200"
    >
      <FaUserEdit className="text-red-400 group-hover:scale-110 transition"/>
      Edit Profile
    </button>

  </div>

</div>
                </>
              ) : (

                <div className="flex flex-col gap-4 mt-4">

                  <label className="text-sm text-gray-400">
                    Full Name
                  </label>

                  <div className="relative">

                    <FaUserEdit className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                    <input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full bg-black/40 border border-white/10 rounded-xl
                      pl-11 pr-4 py-3 text-white placeholder-gray-500
                      focus:ring-2 focus:ring-red-500 outline-none transition"
                    />

                  </div>

                  <p className="text-xs text-gray-500">
                    This name will appear on your profile.
                  </p>

                  <div className="flex gap-3 pt-2">

                    <button
                      onClick={handleUpdateName}
                      className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-red-600 to-pink-600 hover:shadow-lg hover:shadow-red-500/30 hover:scale-[1.03] transition"
                    >
                      Save Changes
                    </button>

                    <button
                      onClick={() => setEditingName(false)}
                      className="px-6 py-2.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition"
                    >
                      Cancel
                    </button>

                  </div>

                </div>

              )}

            </div>

            {/* REMOVE IMAGE */}
            <button
              onClick={handleRemoveImage}
              disabled={uploading}
              className="flex items-center gap-2 mt-6 md:mt-0 px-4 py-2 rounded-lg
              text-red-400 border border-red-500/20 bg-red-500/10
              hover:bg-red-500/20 transition"
            >
              <FaTrashAlt />
              Remove Photo
            </button>

          </div>

      
          {/* SIGN OUT */}
          <div className="mt-12 text-center">

            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="inline-flex items-center gap-3 px-8 py-3 rounded-full
              bg-gradient-to-r from-red-600 to-black/10 border border-red-500
              hover:shadow-xl hover:shadow-red-500/40
              hover:scale-105 transition-all"
            >
              <FaSignOutAlt />
              Sign Out
            </button>

          </div>

        </div>

      </div>

      {/* LOGOUT MODAL */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">

          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-8 w-[320px] text-center shadow-xl">

            <h3 className="text-lg font-semibold mb-4">
              Sign out?
            </h3>

            <p className="text-gray-400 text-sm mb-6">
              Are you sure you want to sign out?
            </p>

            <div className="flex justify-center gap-4">

              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
              >
                Cancel
              </button>

              <SignOutButton>
                <button className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 transition">
                  Sign Out
                </button>
              </SignOutButton>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}