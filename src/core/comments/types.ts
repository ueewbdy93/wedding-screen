import * as actions from "./actions";
import { ActionType } from "typesafe-actions";

export type ActionTypes = ActionType<typeof actions>;

export interface IComment {
  content: string;
  offset: number;
  createAt: number;
}
