"use client";

import { Card, CardBody } from "@nextui-org/react";
import Image from "next/image";
import { useTheme } from "next-themes";
import React from "react";

import { Flex } from "../styles/flex";


export const CardTransactions = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Card
      className={`w-full rounded-xl px-6 shadow-2xl transition-shadow duration-300 hover:shadow-[0_10px_40px_rgba(0,0,0,0.2)] ${
        isDark ? "bg-zinc-900" : "bg-default-100"
      }`}
    >
      <CardBody className="py-10">
        <Flex className="justify-center gap-5">
          <h3
            className={`text-center text-2xl font-semibold ${
              isDark ? "text-white" : "text-black"
            }`}
          >
            Latest Transactions
          </h3>
        </Flex>

        <Flex className="flex-col gap-6 py-4">
          {transactions.map(({ name, amount, date }, index) => (
            <Flex
              key={index}
              className="items-center justify-between gap-4"
              align="center"
            >
              <div className="relative h-12 w-12 flex-shrink-0 rounded-full bg-gradient-to-tr from-blue-500 to-blue-300 p-[2px]">
                <div className="relative h-full w-full overflow-hidden rounded-full">
                  <Image
                    src={`https://i.pravatar.cc/48?u=a042581f4e29026024d&img=${index}`}
                    alt={name}
                    fill
                    className="rounded-full object-cover"
                    sizes="48px"
                  />
                </div>
              </div>

              <span
                className={`min-w-0 flex-1 truncate whitespace-nowrap text-medium font-bold ${
                  isDark ? "text-white" : "text-gray-800"
                }`}
              >
                {name}
              </span>

              <span
                className={`whitespace-nowrap text-xs font-bold ${
                  isDark ? "text-green-400" : "text-green-600"
                }`}
              >
                {amount}
              </span>

              <span
                className={`whitespace-nowrap text-xs font-bold ${
                  isDark ? "text-gray-400" : "text-default-500"
                }`}
              >
                {date}
              </span>
            </Flex>
          ))}
        </Flex>
      </CardBody>
    </Card>
  );
};

const transactions = [
  { name: "Jose Perez", amount: "4500 USD", date: "9/20/2021" },
  { name: "Andrew Steven", amount: "4500 USD", date: "9/20/2021" },
  { name: "Ruben Garcia", amount: "1500 USD", date: "2/20/2022" },
  { name: "Perla Garcia", amount: "200 USD", date: "3/20/2022" },
  { name: "Mathew Funez", amount: "2444 USD", date: "5/20/2022" },
  { name: "Carlos Diaz", amount: "3000 USD", date: "12/20/2022" },
];
