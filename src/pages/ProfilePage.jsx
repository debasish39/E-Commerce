import { useUser, UserProfile, SignOutButton } from "@clerk/clerk-react";
import { useState } from "react";
import { FaSignOutAlt, FaUser, FaTimes } from "react-icons/fa";
import FuzzyText from "../components/FuzzyText";
import {
Modal,
ModalContent,
ModalHeader,
ModalBody,
ModalFooter,
Button
} from "@heroui/react";

export default function ProfilePage() {
const { user, isLoaded } = useUser();

const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
const [openProfile, setOpenProfile] = useState(false);

if (!isLoaded) return null;

return ( <div
   className="
   min-h-screen flex justify-center px-4 py-12 text-white
   bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.25),transparent_60%)]
   "
 > <div className="w-full max-w-7xl">

```
    {/* COVER */}
    <div className="relative h-40 rounded-3xl overflow-hidden">

      <div
        className="
        absolute inset-0 opacity-30 blur-xl animate-spinSlow
        bg-[conic-gradient(from_180deg_at_50%_50%,#2563eb,#6366f1,#7c3aed,#2563eb)]
        "
      />

      <div className="absolute inset-0 backdrop-blur-xl bg-black/30 border border-white/10" />

      <div className="absolute inset-0 flex items-center justify-center">

        <div className="relative px-10 py-5 rounded-3xl bg-black/40 backdrop-blur-xl border border-white/10">

          <div
            className="
            absolute -inset-4 blur-2xl opacity-20 rounded-3xl
            bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500
            "
          />

          <FuzzyText
            fontSize="clamp(2rem,6vw,5rem)"
            fontWeight={900}
            color="#ffffff"
            baseIntensity={0.12}
            hoverIntensity={0.40}
          >
            E-Shop
          </FuzzyText>

        </div>

      </div>

    </div>

    {/* USER HEADER */}
    <div
      className="
      relative mt-10 p-8 rounded-3xl
      bg-white/5 backdrop-blur-2xl border border-white/10
      shadow-[0_10px_40px_rgba(0,0,0,0.6)]
      "
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

        {/* USER INFO */}
        <div className="flex items-center gap-5">

          <div className="relative">

            <div
              className="
              absolute -inset-2 rounded-full blur-lg opacity-40
              bg-gradient-to-tr from-blue-500 to-indigo-500
              "
            />

            <img
              src={user?.imageUrl}
              alt="avatar"
              className="
              relative h-20 w-20 rounded-full object-cover
              border border-white/20
              "
            />

          </div>

          <div>

            <h1
              className="
              text-2xl font-semibold tracking-tight
              bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500
              bg-clip-text text-transparent
              "
            >
              {user?.fullName}
            </h1>

            <p className="text-sm text-gray-400 mt-1">
              {user?.primaryEmailAddress?.emailAddress}
            </p>

          </div>

        </div>

        
       {/* ACTION BUTTONS */}
<div className="flex gap-1 overflow-x-auto whitespace-nowrap scrollbar-hide">

  {/* Profile Settings */}
  <Button
    onPress={() => setOpenProfile(true)}
    startContent={<FaUser size={18} />}
    className="
    flex items-center gap-2 shrink-0  

    px-3 sm:px-5 py-2.5

    bg-black/30 backdrop-blur-lg
    border border-white/10
    text-white

    rounded-xl sm:rounded-2xl

    transition-all duration-300

    hover:bg-indigo-500/20
    hover:border-indigo-400/40
    hover:scale-[1.03]

    active:scale-95 active:bg-indigo-500/20
    "
  >
    Profile Settings
  </Button>

  {/* Sign Out */}
  <Button
    onPress={() => setShowLogoutConfirm(true)}
    startContent={<FaSignOutAlt size={18} />}
    className="
    flex items-center gap-2 shrink-0   /* ✅ prevents shrinking */

    px-4 sm:px-5 py-2.5

    bg-gradient-to-r from-blue-600 to-indigo-600
    text-white

    rounded-xl sm:rounded-2xl

    transition-all duration-300

    hover:scale-[1.03]
    active:scale-95
    "
  >
    Sign Out
  </Button>

</div>

      </div>
    </div>

  </div>

  {/* PROFILE SETTINGS MODAL */}
  <Modal
    size="5xl"
    isOpen={openProfile}
    onOpenChange={setOpenProfile}
    backdrop="blur"
    hideCloseButton
    scrollBehavior="inside"
  >

    <ModalContent>

      <ModalHeader className="relative border-b border-white/10">

        <span className="text-2xl font-semibold text-indigo-600">
          Profile Settings
        </span>

        <button
          onClick={() => setOpenProfile(false)}
          className="
          absolute right-4 top-1/2 -translate-y-1/2
          w-9 h-9 flex items-center justify-center
          rounded-full bg-black/10
          hover:bg-indigo-500/70 text-indigo-500 hover:text-indigo-100
          transition
          "
        >
          <FaTimes size={18} />
        </button>

      </ModalHeader>

      <ModalBody className="m-0 sm:mx-auto">

        <div className="max-h-[75vh] overflow-x-auto overflow-y-hidden">
          <UserProfile />
        </div>

      </ModalBody>

    </ModalContent>

  </Modal>

  {/* LOGOUT CONFIRM MODAL */}
  <Modal
    isOpen={showLogoutConfirm}
    onOpenChange={setShowLogoutConfirm}
    placement="center"
    hideCloseButton
    backdrop="blur"
    classNames={{
      base: `
      bg-white/60 backdrop-blur-2xl border border-white/10
      text-gray-900 rounded-3xl
      `,
      backdrop: "bg-white/30 backdrop-blur-md"
    }}
  >

    <ModalContent>

      <ModalHeader className="border-b border-white/10">
        Sign out?
      </ModalHeader>

      <ModalBody>
        <p className="text-sm text-gray-400">
          Are you sure you want to sign out?
        </p>
      </ModalBody>

      <ModalFooter>

        <Button
          variant="flat"
          onPress={() => setShowLogoutConfirm(false)}
          className="
          bg-white/10 hover:bg-indigo-500/20
          text-gray-500 rounded-2xl
          "
        >
          Cancel
        </Button>

        <SignOutButton >
          <Button
            className="
            bg-gradient-to-r from-blue-600 to-indigo-600
            hover:shadow-lg hover:shadow-indigo-500/30
            text-white rounded-2xl
            "
          >
            Sign Out
          </Button>
        </SignOutButton>

      </ModalFooter>

    </ModalContent>

  </Modal>

</div>


);
}
