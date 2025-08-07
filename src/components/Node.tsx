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
        className="px-2 py-8 text-center border-2"
        onClick={() => {
          if (!isSamePlayer) modifyScore();
        }}
      ></div>
    );

  switch (val) {
    case 1:
      return (
        <div
          className="px-2 py-8 text-center bg-green-600 cursor-pointer"
          onClick={() => modifyScore()}
        ></div>
      );
    case -1:
      return (
        <div
          className="px-2 py-8 text-center bg-red-600 cursor-pointer"
          onClick={() => modifyScore()}
        ></div>
      );
    default:
      return (
        <div
          className="px-2 py-8 text-center  bg-gray-600 cursor-pointer"
          onClick={() => modifyScore()}
        ></div>
      );
  }
};

export default Node;
