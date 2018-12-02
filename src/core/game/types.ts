import {
  addPlayer,
  nextQuestion,
  resetPlayerAnswers,
  setQuestionIndex,
  setRank,
  setStage,
  updatePlayerAnswer,
  updatePlayerScore,
} from './actions';

export type ActionTypes = $Call<
  typeof nextQuestion |
  typeof setQuestionIndex |

  typeof addPlayer |
  typeof resetPlayerAnswers |
  typeof updatePlayerScore |
  typeof updatePlayerAnswer |

  typeof setStage |

  typeof setRank
  >;

export type Player = Readonly<{
  name: string,
  id: string,
  score: number,
}>;
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

export type GameState = Readonly<{
  intervalMs: Readonly<Number>,
  players: ReadonlyArray<Player>,
  stage: Stage,
  questions: ReadonlyArray<Question>,
  questionIndex: number,
  rank: ReadonlyArray<Player>,
  playerAnswers: ReadonlyArray<PlayerAnswers>,
}>;
