import { useUser, SignOutButton } from "@clerk/clerk-react";
import { useState } from "react";
import { toast } from "sonner";

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
    } catch (error) {
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

  /* ================= EDIT FULL NAME ================= */
  const handleUpdateName = async () => {
    if (!fullName.trim()) return;

    const names = fullName.split(" ");
    const firstName = names[0];
    const lastName = names.slice(1).join(" ");

    try {
      await user.update({
        firstName,
        lastName,
      });

      toast.success("Name updated successfully ✨");
      setEditingName(false);
    } catch (err) {
      toast.error("Failed to update name");
    }
  };

  /* ================= SIGN OUT CONFIRM ================= */
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
    <div className="min-h-screen pt-20 mb-6 px-4 flex justify-center">
      <div className="w-full max-w-4xl  border border-red-500/40 rounded-2xl p-8">

        {/* ================= HEADER ================= */}
        <div className="flex flex-col sm:flex-row items-center gap-8">

          <div className="relative group">
            <img
              src={user?.imageUrl}
              alt="avatar"
              className="h-28 w-28 rounded-full ring-4 ring-red-500 object-cover"
            />

            {/* Upload Overlay */}
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

          <div className="text-center sm:text-left w-full">

            {/* ===== Editable Name ===== */}
            {!editingName ? (
              <>
                <h2 className="text-2xl font-bold text-red-400">
                  {user?.fullName}
                </h2>

                <button
                  onClick={() => {
                    setFullName(user?.fullName || "");
                    setEditingName(true);
                  }}
                  className="text-sm text-red-400 hover:underline mt-1"
                >
                  Edit Name
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-3 mt-2">
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="bg-black/40 border border-red-500/30 
                  rounded-xl p-2 text-white"
                />

                <div className="flex gap-4">
                  <button
                    onClick={handleUpdateName}
                    className="px-4 py-1 rounded-lg bg-red-600"
                  >
                    Save
                  </button>

                  <button
                    onClick={() => setEditingName(false)}
                    className="px-4 py-1 rounded-lg bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <p className="text-gray-400 mt-3">
              {user?.primaryEmailAddress?.emailAddress}
            </p>

            <button
              onClick={handleRemoveImage}
              disabled={uploading}
              className="mt-4 text-sm text-red-400 hover:underline"
            >
              Remove Image
            </button>
          </div>
        </div>

        {/* ================= ACCOUNT INFO ================= */}
        <div className="mt-10 grid sm:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl bg-black/40 border border-red-500/20">
            <p className="text-gray-400 text-sm">First Name</p>
            <p className="text-white font-medium mt-1">
              {user?.firstName}
            </p>
          </div>

          <div className="p-6 rounded-xl bg-black/40 border border-red-500/20">
            <p className="text-gray-400 text-sm">Last Name</p>
            <p className="text-white font-medium mt-1">
              {user?.lastName}
            </p>
          </div>
        </div>

        {/* ================= LOGOUT ================= */}
        <div className="mt-12">

          <button
            onClick={handleSignOutToast}
            className="px-6 py-3 rounded-xl
              bg-gradient-to-r from-red-600 to-pink-600
              hover:shadow-lg hover:shadow-red-500/30 transition"
          >
            Sign Out
          </button>

          {/* Hidden real signout */}
          <SignOutButton>
            <button id="realSignOutBtn" className="hidden" />
          </SignOutButton>

        </div>

      </div>
    </div>
  );
}