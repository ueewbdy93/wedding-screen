import { $Call } from 'utility-types';
import { addComment, removeComments } from './actions';

export type ActionTypes = $Call<
  typeof addComment |
  typeof removeComments
>;


export interface Comment {
  id: string;
  timestamp: Date;
  content: string;
}
