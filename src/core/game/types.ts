import { ActionType } from 'typesafe-actions';
import * as actions from './actions';

export type ActionTypes = ActionType<typeof actions>;

export enum PlayerState { NEW, UP, DOWN, EQUAL }
export interface IPlayer {
  id: string;
  name: string;
  score: number;
  timeBonus: number;
  rank: number;
  correctCount: number;
  incorrectCount: number;
  correctRate: number;
  time: number;
  state: PlayerState;
  results: boolean[];
  createAt: number;
}
export enum Stage { JOIN, START_QUESTION, START_ANSWER, REVEAL_ANSWER, SCORE, FINAL }
export type Option = Readonly<{
  id: number,
  text: string,
}>;
export type Question = Readonly<{
  id: number,
  text: string,
  options: ReadonlyArray<Option>,
  answer: Option,
}>;

export type PlayerAnswer = Readonly<{
  playerID: string,
  optionID: number,
  questionIndex: number,
  createTime: number,
}>;

export type PlayerAnswers = Readonly<{
  [playerID: string]: PlayerAnswer,
}>;

export type PlayerVote = Readonly<{
  playerId: string,
  questionId: number,
  optionId: number,
  time: number,
  isAnswer: boolean,
}>;

export type GameState = Readonly<{
  intervalMs: number,
  players: ReadonlyArray<IPlayer>,
  stage: Stage,
  questionIndex: number,
  playerVotes: { [key: string]: PlayerVote },
}>;
