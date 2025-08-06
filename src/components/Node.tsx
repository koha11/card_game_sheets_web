import type { Round } from "@/interfaces";
import { useState } from "react";

const Node = ({
  val,
  isSamePlayer,
  modifyScore,
}: {
  val: number;
  isSamePlayer: boolean;
  modifyScore: () => void;
}) => {
  const [isLock, setLock] = useState(false);

  if (isSamePlayer || val == 2)
    return (
      <div
        className="px-2 py-4 text-center text-xl"
        onClick={() => {
          if (!isSamePlayer) modifyScore();
        }}
      ></div>
    );

  switch (val) {
    case 1:
      return (
        <div
          className="px-2 py-4 text-center text-xl bg-green-600 cursor-pointer"
          onClick={() => modifyScore()}
        >
          Ăn
        </div>
      );
    case -1:
      return (
        <div
          className="px-2 py-4 text-center text-xl bg-red-600 cursor-pointer"
          onClick={() => modifyScore()}
        >
          Thua
        </div>
      );
    default:
      return (
        <div
          className="px-2 py-4 text-center text-xl  bg-gray-600 cursor-pointer"
          onClick={() => modifyScore()}
        >
          Hòa
        </div>
      );
  }
};

export default Node;
