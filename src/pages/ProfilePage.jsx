import { useUser, SignOutButton } from "@clerk/clerk-react";
import { useState } from "react";
import { toast } from "sonner";
import { FaUserEdit, FaTrashAlt, FaSignOutAlt } from "react-icons/fa";

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const [uploading, setUploading] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [fullName, setFullName] = useState("");

  if (!isLoaded) return null;

  /* ================= IMAGE UPDATE ================= */
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

  /* ================= REMOVE IMAGE ================= */
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

  /* ================= UPDATE NAME ================= */
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

  const handleSignOutToast = () => {
    toast("Are you sure you want to sign out?", {
      action: {
        label: "Sign Out",
        onClick: () => {
          document.getElementById("realSignOutBtn").click();
        },
      },
    });
  };

  return (
    <div className="min-h-screen  sm:px-4 flex justify-center items-center  text-white">
      <div className="w-full max-w-5xl backdrop-blur-xl bg-black/3 border border-white/10 rounded-3xl shadow-2xl p-6">

       
        <div className="flex flex-col sm:flex-row items-center gap-10">

         
          <div className="relative group">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-red-500 to-pink-500 blur-lg opacity-40 group-hover:opacity-70 transition duration-500"></div>

            <img
              src={user?.imageUrl}
              alt="avatar"
              className="relative h-36 w-36 rounded-full object-cover border-4 border-red-500 shadow-xl"
            />

            <label className="absolute inset-0 bg-black/60 
              opacity-0 group-hover:opacity-100 
              flex items-center justify-center 
              rounded-full cursor-pointer transition">
              {uploading ? (
                <span className="text-xs">Uploading...</span>
              ) : (
                <span className="text-xs">Change</span>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex-1 text-center sm:text-left">

            {!editingName ? (
              <>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
                  {user?.fullName}
                </h2>

                <button
                  onClick={() => {
                    setFullName(user?.fullName || "");
                    setEditingName(true);
                  }}
                  className="flex items-center gap-2 text-sm mt-2 text-red-400 hover:underline cursor-pointer"
                >
                  <FaUserEdit /> Edit Name
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-4 mt-4">
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="bg-black/40 border border-red-500/40 rounded-xl p-3 text-white focus:ring-2 focus:ring-red-500 outline-none"
                />
                <div className="flex gap-4">
                  <button
                    onClick={handleUpdateName}
                    className="px-6 py-2 rounded-lg bg-gradient-to-r from-red-600 to-pink-600 hover:scale-105 transition cursor-pointer"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingName(false)}
                    className="px-6 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <p className="text-gray-400 mt-4">
              {user?.primaryEmailAddress?.emailAddress}
            </p>

            <button
              onClick={handleRemoveImage}
              disabled={uploading}
              className="flex items-center gap-2 mt-4 text-sm text-red-400 hover:text-red-300 transition"
            >
              <FaTrashAlt /> Remove Image
            </button>
          </div>
        </div>

     <div className="mt-12 grid sm:grid-cols-2 gap-8">
  
  <div className="p-3 px-9 rounded-2xl bg-gradient-to-br from-zinc-900/70 to-zinc-800/40 
                  backdrop-blur-xl border border-white/10 
                  shadow-lg hover:shadow-red-500/20 
                  hover:scale-[1.02] transition-all duration-300">
    
    <p className="text-gray-400 text-sm tracking-wide uppercase">
      First Name
    </p>
    
    <p className="text-2xl font-semibold mt-1 text-white">
      {user?.firstName || "—"}
    </p>
    
  </div>

  <div className="p-3 px-9 rounded-2xl bg-gradient-to-br from-zinc-900/70 to-zinc-800/40 
                  backdrop-blur-xl border border-white/10 
                  shadow-lg hover:shadow-red-500/20 
                  hover:scale-[1.02] transition-all duration-300">
    
    <p className="text-gray-400 text-sm tracking-wide uppercase">
      Last Name
    </p>
    
    <p className="text-2xl font-semibold mt-1 text-white">
      {user?.lastName || "—"}
    </p>

  </div>

</div>


        <div className="mt-9 text-center">
          <button
            onClick={handleSignOutToast}
            className="flex items-center justify-center gap-3 mx-auto px-8 py-3 rounded-full
            bg-gradient-to-r from-red-600 to-pink-600
            hover:shadow-xl hover:shadow-red-500/40
            hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            <FaSignOutAlt /> Sign Out
          </button>

          <SignOutButton>
            <button id="realSignOutBtn" className="hidden" />
          </SignOutButton>
        </div>

      </div>
    </div>
  );
}