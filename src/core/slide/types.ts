import { ActionType } from 'typesafe-actions'; 
import * as actions from './actions';

export type ActionTypes = ActionType<typeof actions>;
