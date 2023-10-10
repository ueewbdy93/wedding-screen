import { createStandardAction } from "typesafe-actions";
import { IComment } from "./types";

const ADD_COMMENT = "ADD_COMMENT";
const REMOVE_COMMENTS = "REMOVE_COMMENTS";
const SET_CURRENT_ROUND_START_OFFSET = "SET_CURRENT_ROUND_START_TIME";

export const addComment = createStandardAction(ADD_COMMENT)<IComment>();

export const removeComments = createStandardAction(REMOVE_COMMENTS)();

export const setCurrentRoundStartTime = createStandardAction(
  SET_CURRENT_ROUND_START_OFFSET
)<{ offset: number }>();
