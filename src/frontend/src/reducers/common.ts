import { createStandardAction, ActionType, getType } from "typesafe-actions";
import { Mode } from "../../../core/root-types";

// reducer with initial state
const initialState = {
  mode: -1,
};

export const Actions = {
  changeMode: createStandardAction("MODE_CHANGE")<{ mode: Mode }>(),
};

export default function reducer(
  state = initialState,
  action: ActionType<typeof Actions>
) {
  switch (action.type) {
    case getType(Actions.changeMode):
      return { ...action.payload };
    default:
      return state;
  }
}
