import {
  addPlayer,
  nextQuestion,
  resetPlayerAnswers,
  setQuestionIndex,
  setRank,
  setStage,
  updatePlayerScore,
  updatePlayerSelectedOption,
} from './actions';

export type ActionTypes = $Call<
  typeof nextQuestion |
  typeof setQuestionIndex |

  typeof addPlayer |
  typeof resetPlayerAnswers |
  typeof updatePlayerScore |
  typeof updatePlayerSelectedOption |

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
  id: string,
  text: string,
}>;
export type Question = Readonly<{
  id: string,
  text: string,
  options: ReadonlyArray<Option>,
  answer: Option,
}>;

export type PlayerAnswer = Readonly<{
  playerID: string,
  optionID: string,
  questionIndex: number,
  createTime: number,
}>;

export type PlayerAnswers = Readonly<{
  [playerID: string]: PlayerAnswer,
}>;

export type GameState = Readonly<{
  players: ReadonlyArray<Player>,
  stage: Stage,
  questions: ReadonlyArray<Question>,
  questionIndex: number,
  rank: ReadonlyArray<Player>,
  selectedOption: ReadonlyArray<PlayerAnswers>,
}>;
