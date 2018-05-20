import { addPlayer, nextQuestion, setQuestionIndex, setStage, updatePlayerScore } from './actions';

export type ActionTypes = $Call<
  typeof nextQuestion |
  typeof setQuestionIndex |

  typeof addPlayer |
  typeof updatePlayerScore |

  typeof setStage
  >;

export type Player = Readonly<{
  name: string,
  id: string,
  score: number,
}>;
export enum Stage { JOIN, START_QUESTION, START_ANSWER, REVEAL_ANSWER, SCORE, FINAL }
export type Option = Readonly<{
  id: string,
  text: string,
}>;
export type Question = Readonly<{
  id: string,
  text: string,
  options: ReadonlyArray<Option>,
  answer: Option,
}>;
export type GameState = Readonly<{
  players: ReadonlyArray<Player>,
  stage: Stage,
  questions: ReadonlyArray<Question>,
  questionIndex: number,
  rank: ReadonlyArray<Player>,
}>;
