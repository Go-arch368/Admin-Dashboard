"use client";
import {
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    Button,
    useDisclosure,
    Input,
} from "@heroui/react";
import React from "react";
import { FiSearch, FiMapPin, FiChevronDown, FiX } from "react-icons/fi";

export default function LocationModal() {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            <Button
                onClick={onOpen}
                variant="flat"
                className="text-sm font-medium flex items-center gap-1"
            >
                Select Location <FiChevronDown className="h-4 w-4" />
            </Button>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                backdrop="opaque"
                placement="center"
                hideCloseButton={true}
                className="rounded-xl shadow-2xl"
            >
                <ModalContent className="bg-white dark:bg-gray-800 max-w-md">
                    {() => (
                        <>
                            <ModalHeader className="flex flex-col gap-4 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex justify-between items-center w-full">
                                    <span className="text-lg font-semibold">Your Location</span>
                                    <Button
                                        isIconOnly
                                        size="sm"
                                        variant="light"
                                        onClick={onClose} // Using the hook's onClose directly
                                        aria-label="Close"
                                        className="rounded-full bg-gray-200 dark:bg-red-500 text-gray-600 dark:text-white w-6 h-6 min-w-6"
                                    >
                                        <FiX className="h-3 w-3" />
                                    </Button>
                                </div>

                                <Input
                                    placeholder="  Search a new address"
                                    startContent={<FiSearch className="text-gray-400" />}
                                    className="w-full"
                                />
                            </ModalHeader>

                            <ModalBody className="py-4">
                                {/* Current Location */}
                                <div className="flex items-center gap-2 mb-4">
                                    <FiMapPin className="text-red-500 h-5 w-5" />
                                    <span className="font-medium text-red-500">Current Location</span>
                                </div>

                                <div className="space-y-3 text-base text-gray-800 dark:text-gray-200 pl-7">
                                    <p className="flex items-center gap-2">
                                        <span className="font-semibold min-w-[60px]">City:</span>
                                        <span>Bengaluru</span>
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <span className="font-semibold min-w-[60px]">Pincode:</span>
                                        <span>560072</span>
                                    </p>
                                </div>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}