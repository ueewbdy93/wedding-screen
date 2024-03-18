export interface IClickEvent {
  readonly id: string;
  readonly tableId: number;
  readonly name: string;
  readonly clicks: number;
}

export interface IPlayer {
  readonly id: string;
  readonly tableId: number;
  readonly name: string;
}

export interface IModel {
  readonly state: "registering" | "playing" | "playing2" | "end";
  readonly players: readonly IPlayer[];
  readonly clickEvents: readonly IClickEvent[];
}
