"use client";
import {
  Button,
  Divider,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import React from "react";

import { Flex } from "../styles/flex";

export const AddUser: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <div>
      <Button
        onPress={openModal}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow transition-all hover:bg-blue-700"
      >
        Add User
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        size="xl"
        backdrop="blur"
        placement="center"
        className="z-[9999]" // <-- Add this line
        classNames={{
          base: "bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100",
          backdrop: "bg-black/50 z-[9998]", // <-- Ensure backdrop is behind modal
          closeButton: "hover:bg-gray-100 dark:hover:bg-gray-700",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h4 className="text-xl font-semibold dark:text-white">
                  Add New User
                </h4>
              </ModalHeader>

              <Divider className="my-2 dark:bg-gray-700" />

              <ModalBody className="py-6">
                <Flex direction="column" className="gap-4 lg:gap-6">
                  {/* Name Row */}
                  <Flex className="flex-wrap gap-4 lg:flex-nowrap">
                    <Input
                      variant="bordered"
                      fullWidth
                      size="lg"
                      placeholder="Enter first name"
                      classNames={{
                        inputWrapper:
                          "bg-white dark:bg-gray-800 border dark:border-gray-700",
                      }}
                    />
                    <Input
                      variant="bordered"
                      fullWidth
                      size="lg"
                      placeholder="Enter last name"
                      classNames={{
                        inputWrapper:
                          "bg-white dark:bg-gray-800 border dark:border-gray-700",
                      }}
                    />
                  </Flex>

                  {/* Contact Row */}
                  <Flex className="flex-wrap gap-4 lg:flex-nowrap">
                    <Input
                      variant="bordered"
                      fullWidth
                      size="lg"
                      type="email"
                      placeholder="Enter email"
                      classNames={{
                        inputWrapper:
                          "bg-white dark:bg-gray-800 border dark:border-gray-700",
                      }}
                    />
                    <Input
                      variant="bordered"
                      fullWidth
                      size="lg"
                      type="tel"
                      placeholder="Enter phone number"
                      classNames={{
                        inputWrapper:
                          "bg-white dark:bg-gray-800 border dark:border-gray-700",
                      }}
                    />
                  </Flex>

                  {/* Work Info Row */}
                  <Flex className="flex-wrap gap-4 lg:flex-nowrap">
                    <Input
                      variant="bordered"
                      fullWidth
                      size="lg"
                      placeholder="Enter department"
                      classNames={{
                        inputWrapper:
                          "bg-white dark:bg-gray-800 border dark:border-gray-700",
                      }}
                    />
                    <Input
                      variant="bordered"
                      fullWidth
                      size="lg"
                      placeholder="Enter company"
                      classNames={{
                        inputWrapper:
                          "bg-white dark:bg-gray-800 border dark:border-gray-700",
                      }}
                    />
                  </Flex>
                </Flex>
              </ModalBody>

              <Divider className="my-2 dark:bg-gray-700" />

              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={onClose}
                  className="dark:text-red-500"
                >
                  Cancel
                </Button>
                <Button color="primary" onPress={onClose}>
                  Add User
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
