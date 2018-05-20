import { addComment, removeComments, setCurrentRoundStartOffset } from './actions';

export type ActionTypes = $Call<
  typeof addComment |
  typeof removeComments |
  typeof setCurrentRoundStartOffset
>;


export interface Comment {
  id: string;
  offsetSec: number;
  content: string;
}
