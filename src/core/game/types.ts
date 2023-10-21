import { ActionType } from 'typesafe-actions';
import * as actions from './actions';

export type ActionTypes = ActionType<typeof actions>;

export enum PlayerState { NEW, UP, DOWN, EQUAL }
export interface IPlayer {
  readonly id: string;
  readonly name: string;
  readonly score: number;
  readonly timeBonus: number;
  readonly rank: number;
  readonly correctCount: number;
  readonly incorrectCount: number;
  readonly correctRate: number;
  readonly time: number;
  readonly state: PlayerState;
  readonly results: readonly boolean[];
  readonly createAt: number;
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
