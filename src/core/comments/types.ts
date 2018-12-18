import { addComment, removeComments, setCurrentRoundStartTime } from './actions';

export type ActionTypes = $Call<
  typeof addComment |
  typeof removeComments |
  typeof setCurrentRoundStartTime
>;


export interface Comment {
  content: string;
  offset: number;
  createAt: number;
}
