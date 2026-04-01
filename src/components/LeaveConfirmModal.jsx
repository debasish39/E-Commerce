import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react";

export default function LeaveConfirmModal({ isOpen, onStay, onLeave }) {
  return (
    <Modal isOpen={isOpen} onClose={onStay} placement="center" backdrop="blur">
      <ModalContent className="rounded-xl border border-gray-200 shadow-xl">
        <ModalHeader className="text-lg font-semibold text-gray-800">
          Leave this page?
        </ModalHeader>

        <ModalBody className="text-sm text-gray-600">
          You have unsaved changes. Are you sure you want to leave?
        </ModalBody>

        <ModalFooter className="flex gap-3">
          <Button variant="bordered" onClick={onStay}>
            Stay
          </Button>

          <Button color="danger" onClick={onLeave}>
            Leave
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}