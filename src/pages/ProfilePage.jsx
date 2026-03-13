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

  return (
    <div
      className="
      min-h-screen
      flex justify-center
      px-4 py-12
      text-white
      bg-[radial-gradient(circle_at_top,rgba(255,0,0,0.15),transparent_60%)]
    "
    >
      <div className="w-full max-w-7xl">

        {/* COVER */}
        <div className="relative h-39 rounded-3xl overflow-hidden">
          <div className="absolute inset-0
bg-[conic-gradient(from_180deg_at_50%_50%,#ef4444,#dc2626,#fb7185,#ef4444)]
opacity-30 blur-xl animate-spinSlow" />

          <div className="absolute inset-0 backdrop-blur-xl bg-black/30 border border-white/10" />

          <div className="absolute inset-0 flex items-center justify-center">

            <div className="relative px-10 py-5 rounded-3xl
bg-black/40 backdrop-blur-xl border border-white/10">

              <div className="absolute -inset-4 bg-gradient-to-r
from-red-500 via-pink-500 to-purple-500
opacity-20 blur-2xl rounded-3xl"/>

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
          relative
          mt-10
          p-8
          rounded-3xl
          bg-white/5
          backdrop-blur-2xl
          border border-white/10
          shadow-[0_10px_40px_rgba(0,0,0,0.6)]
        "
        >

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

            {/* USER INFO */}
            <div className="flex items-center gap-5">

              <div className="relative">

                <div
                  className="
                  absolute -inset-2
                  rounded-full
                  bg-gradient-to-tr
                  from-red-500 to-pink-500
                  blur-lg
                  opacity-40
                "
                />

                <img
                  src={user?.imageUrl}
                  alt="avatar"
                  className="
                  relative
                  h-20 w-20
                  rounded-full
                  border border-white/20
                  object-cover
                "
                />

              </div>

              <div>

                <h1
                  className="
                  text-2xl font-semibold tracking-tight
                  bg-gradient-to-r
                  from-red-400 via-pink-400 to-purple-400
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
            <div className="flex gap-3">

              <Button
                onPress={() => setOpenProfile(true)}
                startContent={<FaUser />}
                className="
                bg-white/10
                backdrop-blur-lg
                border border-white/10
                hover:bg-white/20
                text-white
                rounded-3xl
              "
              >
                Profile Settings
              </Button>

              <Button
                onPress={() => setShowLogoutConfirm(true)}
                startContent={<FaSignOutAlt />}
                className="
                bg-gradient-to-r
                from-red-600 to-red-500
                hover:shadow-lg hover:shadow-red-500/30
                text-white
                rounded-3xl
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
        scrollBehavior="inside"
        isDismissable={true}
        isKeyboardDismissDisabled={false}
      >

        <ModalContent>

          <ModalHeader className="relative border-b border-white/10">

            <span className="text-2xl font-semibold tracking-tight text-gray-400">
              Profile Settings
            </span>

            <button
              onClick={() => setOpenProfile(false)}
              className="
    absolute right-4 top-1/2 -translate-y-1/2
    w-8 h-8
    flex items-center justify-center
    rounded-full
    bg-white/10
    hover:bg-red-500/70
    text-gray-300 hover:text-white
    transition
    z-50
    "
            >
              <FaTimes size={15} />
            </button>

          </ModalHeader>

          <ModalBody className="m-0 sm:mx-auto">

            <div className="max-h-[75vh] overflow-y-hidden overflow-x-auto">
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
        hideCloseButton={true}
        backdrop="blur"
        classNames={{
          base: `
          bg-white/5
          backdrop-blur-2xl
          border border-white/10
          text-white
          rounded-3xl
          `,
          backdrop: "bg-black/70 backdrop-blur-md"
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
              bg-white/10
              hover:bg-white/20
              text-white
              rounded-2xl
            "
            >
              Cancel
            </Button>

            <SignOutButton>
              <Button
                className="
                bg-red-600
                hover:bg-red-500
                text-white
                rounded-2xl
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