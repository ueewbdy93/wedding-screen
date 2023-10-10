import { createStandardAction } from "typesafe-actions";
import { IPlayer, PlayerVote, Stage } from "./types";

const SET_QUESTION_INDEX = "SET_QUESTION_INDEX";
export const setQuestionIndex = createStandardAction(SET_QUESTION_INDEX)<{
  index: number;
}>();

const ADD_PLAYER = "ADD_PLAYER";
export const addPlayer = createStandardAction(ADD_PLAYER)<IPlayer>();

const SET_PLAYERS = "SET_PLAYERS";
export const setPlayers =
  createStandardAction(SET_PLAYERS)<readonly IPlayer[]>();

const UPDATE_PLAYER_VOTE = "UPDATE_PLAYER_VOTE";
export const updatePlayerVote =
  createStandardAction(UPDATE_PLAYER_VOTE)<PlayerVote>();

const RESET_PLAYER_VOTE = "RESET_PLAYER_VOTE";
export const resetPlayerVote = createStandardAction(RESET_PLAYER_VOTE)();

const SET_STAGE = "SET_STAGE";
export const setStage = createStandardAction(SET_STAGE)<Stage>();
