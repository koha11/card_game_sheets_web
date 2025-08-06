import { readMembers } from "@/utils/file.helper";
import React, { useEffect, useState } from "react";

interface Group {
  label: string;
  values: number[][];
}

const groups: Group[] = [
  {
    label: "Ai lam cái (user1)",
    values: [
      [0, -1, 1],
      [0, -1, 1],
      [0, -1, 0],
    ],
  },
  {
    label: "Ai lam cái (user2)",
    values: [
      [1, 0, 1],
      [0, 0, 1],
      [1, 0, 0],
    ],
  },
  {
    label: "Ai lam cái (user3)",
    values: [
      [1, 1, 0],
      [1, -1, 0],
      [1, -1, 0],
    ],
  },
];

const XiDach = () => {
  const [members, setMembers] = useState<string[]>();

  useEffect(() => {
    readMembers().then((members) => setMembers(members));
  }, []);

  console.log(members);

  if (!members) return <></>;

  return (
    <div className="grid grid-cols-4 auto-rows-min border border-gray-300 divide-x divide-gray-300 gap-1">
      {/* Header Row */}
      <div />
      {members.map((member) => (
        <div className="p-2 font-bold text-center">{member}</div>
      ))}

      {/* Data Rows */}
      {groups.map((group, gi) => (
        <React.Fragment key={gi}>
          {/* Label cell spanning rows */}
          <div className="font-semibold bg-gray-50 row-span-3">
            {group.label}
          </div>

          {/* Value cells for each row and column */}
          {group.values.map((row, ri) =>
            row.map((val, ci) => {
              switch (val) {
                case 1:
                  return (
                    <div
                      key={`${gi}-${ri}-${ci}`}
                      className="px-2 py-4 text-center text-xl bg-green-600"
                    >
                      Ăn
                    </div>
                  );
                case -1:
                  return (
                    <div
                      key={`${gi}-${ri}-${ci}`}
                      className="px-2 py-4 text-center text-xl bg-red-600"
                    >
                      Thua
                    </div>
                  );
                default:
                  return (
                    <div
                      key={`${gi}-${ri}-${ci}`}
                      className="px-2 py-4 text-center text-xl  bg-gray-600"
                    >
                      Hòa
                    </div>
                  );
              }
            })
          )}
          {gi < groups.length - 1 && (
            <div className="col-span-4 border-t border-gray-300" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default XiDach;
