import { Card, CardBody } from "@nextui-org/react";
import Image from "next/image";
import React from "react";

const pictureUsers = [
  "https://i.pravatar.cc/150?u=a042581f4e29026024d",
  "https://i.pravatar.cc/150?u=a0425814e29026702d",
  "https://i.pravatar.cc/150?u=a042581d4ef9026700d",
  "https://i.pravatar.cc/150?u=a042581f4e29026704d",
  "https://i.pravatar.cc/150?u=a042581f4e29026024d&img=0",
];

export const CardAgents = () => (
  <div className="flex w-full justify-center px-4 sm:px-0">
    <Card className="w-full max-w-xs rounded-xl bg-default-50 shadow-2xl transition-shadow duration-300 hover:shadow-[0_10px_40px_rgba(0,0,0,0.2)] sm:max-w-sm">
      <CardBody className="flex flex-col items-center justify-center gap-4 p-6">
        {/* Title */}
        <div className="flex w-full justify-center">
          <div className="flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-default-300 px-4 py-2">
            <span className="text-xl">⭐</span>
            <h3 className="m-0 text-lg font-bold">Agents</h3>
          </div>
        </div>

        {/* Description */}
        <p className="text-center text-sm text-default-500">
          Meet your agenda and see their ranks to get the best results
        </p>

        {/* Avatar Group */}
        <div className="flex -space-x-4 pt-2">
          {pictureUsers.map((url, index) => (
            <div
              key={index}
              className="relative z-10 transition-transform duration-300 hover:z-50 hover:translate-x-[-0.75rem]"
            >
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-[2px]">
                <div className="h-full w-full rounded-full bg-white">
                  <Image
                    src={url}
                    alt="avatar"
                    layout="responsive"
                    width={150}
                    height={150}
                    className="h-full w-full rounded-full"
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Extra count */}
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-xs text-white ring-2 ring-white">
            +{12 - pictureUsers.length}
          </div>
        </div>
      </CardBody>
    </Card>
  </div>
);
