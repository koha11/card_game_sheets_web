export interface Turn {
  turnid: number;
  dealer: Player;
  round: Round[];
}

export interface Round {
  roundid: number;
  turnid: number;
  player?: Player;
  playerid?: number;
  value: number;
}

export interface Player {
  playerid: number;
  name: string;
}

export interface Param {
  id: string;
  money_value: number;
  dealer_round: number;
}
