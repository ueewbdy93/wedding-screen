import {
  addPlayer,
  resetPlayerVote,
  setPlayers,
  setQuestionIndex,
  setStage,
  updatePlayerVote,
} from './actions';

export type ActionTypes = $Call<
  typeof setQuestionIndex |

  typeof addPlayer |
  typeof updatePlayerVote |
  typeof resetPlayerVote |
  typeof setPlayers |

  typeof setStage
  >;

export enum PlayerState { NEW, UP, DOWN, EQUAL }
export type Player = {
  id: string,
  name: string,
  score: number,
  rank: number,
  correctCount: number,
  incorrectCount: number,
  correctRate: number,
  time: number,
  state: PlayerState,
  createAt: number,
};
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
  intervalMs: Readonly<Number>,
  players: ReadonlyArray<Player>,
  stage: Stage,
  questionIndex: number,
  playerVotes: { [key: string]: PlayerVote },
}>;
