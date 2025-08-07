import Node from "@/components/Node";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { Param, Player, Round, Turn } from "@/interfaces";

const XiDach = () => {
  const [players, setPlayers] = useState<Player[]>();
  const [game, setGame] = useState<Turn[]>();
  const [money, setMoney] = useState<number[][]>();
  const [param, setParam] = useState<Param>();
  const [lock, setLock] = useState<
    {
      turnid: number;
      roundid: number;
      isLock: boolean;
    }[]
  >([]);
  const flag = useRef<number[][]>([]);

  useEffect(() => {
    fetchGame();
    fetchPlayers();
    fetchParam();
  }, []);

  const modifyScore = async (round: Round) => {
    let newValue;

    switch (round.value) {
      case 1:
        newValue = 0;
        break;
      case 0:
        newValue = -1;
        break;
      case -1:
        newValue = 2;
        break;
      default:
        newValue = 1;
    }

    const { data, error } = await supabase
      .from("round")
      .update({ value: newValue })
      .match({
        turnid: round.turnid,
        playerid: round.player!.playerid,
        roundid: round.roundid,
      });

    if (error) console.error(error);
    else {
      setGame((prev) =>
        prev
          ? prev.map((turn) => {
              if (turn.turnid == round.turnid)
                return {
                  ...turn,
                  round: turn.round.map((myRound) =>
                    myRound.roundid == round.roundid &&
                    myRound.player!.playerid == round.player!.playerid
                      ? { ...round, value: newValue }
                      : myRound
                  ),
                };

              return turn;
            })
          : []
      );
    }
  };

  const calcMoney = () => {
    let myMoney: number[][] = [];

    if (players) {
      myMoney = Array.from({ length: players.length }, () =>
        Array(players.length).fill(0)
      );

      flag.current = Array.from({ length: players.length }, () =>
        Array(players.length).fill(0)
      );
    }

    if (game) {
      game.forEach((turn) =>
        turn.round.forEach((round) => {
          if (round.value != 2) {
            const dealerId = turn.dealer.playerid - 1;
            const playerId = round.player!.playerid - 1;

            myMoney[dealerId][playerId] =
              myMoney[dealerId][playerId] + round.value;
          }
        })
      );
    }

    setMoney(myMoney);
  };

  const fetchPlayers = async () => {
    const { data, error } = await supabase
      .from("player")
      .select("*")
      .order("playerid", { ascending: true });

    if (error) {
      console.error("Error fetching todos:", error);
    } else {
      setPlayers(data);
    }
  };

  const fetchGame = async () => {
    const { data, error } = await supabase
      .from("turn")
      .select(
        `
      turnid,
      dealer:dealerid (
        playerid,
        name
      ),
      round (
        turnid,
        roundid,
        player:playerid (
          playerid,
          name
        ),
        value
      )
    `
      )
      .order("turnid", { ascending: true }) // sort parent table
      .order("playerid", { referencedTable: "round", ascending: true }); // sort child table

    if (error) {
      console.error("Error fetching todos:", error);
    } else {
      console.log(data);
      setGame(data as any);
    }
  };

  const fetchParam = async () => {
    const { data, error } = await supabase.from("param").select("*");

    if (error) {
      console.error("Error fetching todos:", error);
    } else {
      console.log(data);
      setParam(data[0] as any);
    }
  };

  const initNewTurn = async () => {
    if (players && param) {
      const newTurns = players.map((player) => {
        return {
          dealerid: player.playerid,
        };
      });

      const { data: turns, error: turnErr } = await supabase
        .from("turn")
        .insert(newTurns)
        .select();

      if (turnErr) console.error(turnErr);
      else {
        const newRounds = [] as Round[];

        turns.forEach((turn) => {
          let i = 1;

          while (i <= param.dealer_round) {
            players.forEach((player) => {
              newRounds.push({
                turnid: turn.turnid,
                playerid: player.playerid,
                value: 2,
                roundid: i,
              });
            });
            ++i;
          }
        });

        const { data, error } = await supabase
          .from("round")
          .insert(newRounds)
          .select();
        if (error) console.error(error);
        else console.log(data);
      }
    }
  };

  const rest = async () => {
    const { data, error } = await supabase
      .from("turn")
      .delete()
      .neq("turnid", 0);
    if (error) console.error(error);
    else console.log(data);
    await fetchGame();
  };

  if (!players || !game || !param) return <></>;

  return (
    <>
      <div
        className={`grid grid-cols-${
          players.length + 2
        } auto-rows-min border border-gray-300 divide-x divide-gray-300 gap-1`}
      >
        <div
          className={`grid-cols-5 grid-cols-6 grid-cols-7 grid-cols-8 grid-cols-9 
            grid-cols-10 grid-cols-11 col-span-5 col-span-6 col-span-7 col-span-8 
            col-span-9 col-span-10 col-span-11 row-span-3 row-span-4 row-span-5`}
          hidden
        ></div>
        {/* Header Row */}
        <div />
        {players.map((player) => (
          <div className="p-2 font-bold text-center">{player.name}</div>
        ))}
        <div className="p-2 font-bold text-center"></div>
        <div
          className={`col-span-${players.length + 2} border-t border-gray-300`}
        />
        {/* Data Rows */}
        {game.map((turn, gi) => {
          const myRecord: Record<string, Round[]> = {};

          turn.round.forEach((round) => {
            const key = String(round.roundid);
            if (!myRecord[key]) myRecord[key] = [];
            myRecord[key].push(round);
          });

          const rounds = Object.values(myRecord);

          return (
            <React.Fragment key={gi}>
              {/* dealer cell spanning rows */}
              <div
                className={`font-bold text-2xl bg-gray-50 row-span-${param.dealer_round}`}
              >
                {turn.dealer.name}
              </div>

              {/* Value cells for each row and column */}
              {rounds.map((row, ri) => (
                <>
                  {row.map((round, ci) => (
                    <Node
                      val={round.value}
                      key={`${gi}-${ri}-${ci}`}
                      isSamePlayer={gi % players.length == ci}
                      modifyScore={() => {
                        const myLock = lock.find(
                          (myTurn) =>
                            myTurn.turnid == turn.turnid && myTurn.roundid == ri
                        );

                        if (myLock && !myLock.isLock) modifyScore(round);
                      }}
                    ></Node>
                  ))}
                  <div
                    className="cursor-pointer"
                    onClick={() => {
                      setLock((prev) => {
                        if (prev) {
                          const current = prev.find(
                            (myTurn) =>
                              myTurn.turnid == turn.turnid &&
                              myTurn.roundid == ri
                          );

                          if (current) {
                            return prev.map((myTurn) => {
                              if (
                                myTurn.turnid == turn.turnid &&
                                myTurn.roundid == ri
                              )
                                return { ...myTurn, isLock: !myTurn.isLock };

                              return myTurn;
                            });
                          }
                        }

                        return [
                          { turnid: turn.turnid, roundid: ri, isLock: true },
                        ];
                      });
                    }}
                  >
                    {lock.find(
                      (myTurn) =>
                        myTurn.turnid == turn.turnid && myTurn.roundid == ri
                    )
                      ? lock.find(
                          (myTurn) =>
                            myTurn.turnid == turn.turnid && myTurn.roundid == ri
                        )?.isLock
                        ? "click to unlock"
                        : "click to lock"
                      : "click to lock"}
                  </div>
                </>
              ))}
              {gi < game.length - 1 && (
                <div
                  className={`col-span-${
                    players.length + 2
                  } border-t border-gray-300`}
                />
              )}
            </React.Fragment>
          );
        })}

        <div
          className={`col-span-${players.length + 2} border-t border-gray-300`}
        />

        <React.Fragment key={"new"}>
          {/* dealer cell spanning rows */}
          <button
            className={`font-bold text-2xl bg-gray-50 row-span-${param.dealer_round} min-h-[10rem] cursor-pointer`}
            onClick={async () => {
              await initNewTurn();
              await fetchGame();
            }}
          >
            Repeat
          </button>

          {/* Value cells for each row and column */}
          {/* {[0, 0, 0].map((val, ci) => (
            <Node
              val={val}
              key={`new-${ci}`}
              isSamePlayer={true}
              modifyScore={() => {
                // modifyScore(round);
              }}
            ></Node>
          ))} */}
        </React.Fragment>
      </div>
      <div className="mt-20 min-h-[50rem] relative">
        <button onClick={() => calcMoney()}>Tính tiền lại</button>
        {money &&
          param &&
          money.map((arr, i) => {
            return arr.map((val, j) => {
              if (i == j) return <></>;

              if (flag.current[i][j] == 1) return <></>;

              const res = val - money[j][i];

              flag.current[j][i] = 1;

              if (res > 0) {
                return (
                  <div>
                    {players[j].name} nợ {players[i].name}{" "}
                    {(res * param.money_value).toLocaleString()} đồng
                  </div>
                );
              }

              if (res < 0)
                return (
                  <div>
                    {players[i].name} nợ {players[j].name}{" "}
                    {Math.abs(res * param.money_value).toLocaleString()} đồng
                  </div>
                );

              return (
                <div>
                  {players[i].name} huề vốn với {players[j].name}
                </div>
              );
            });
          })}
        <button
          className="absolute bottom-0 right-0"
          onClick={async () => {
            await rest();
          }}
        >
          rest
        </button>
      </div>
    </>
  );
};

export default XiDach;
