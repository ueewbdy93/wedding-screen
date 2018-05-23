import React from 'react';
import Login from './login';

const STAGE_JOIN = 0;
const STAGE_START_QUESTION = 1;
const STAGE_START_ANSWER = 2;
const STAGE_REVEAL_ANSWER = 3;
const STAGE_SCORE = 4;

function GameAdm(props) {
  const {
    stage,
    players,
    question,
    options,
    answer,
    startQuestion,
    startAnswer,
    revealAnswer,
    showScore
  } = props;

  return (
    <div>
      <div>
        <button onClick={startQuestion} disabled={stage !== STAGE_JOIN && stage !== STAGE_SCORE}>
          {stage === STAGE_JOIN ? '開始題目' : '下一題'}
        </button>
        <br />
        <button onClick={startAnswer} disabled={stage !== STAGE_START_QUESTION}>
          開始作答
        </button>
        <br />
        <button onClick={revealAnswer} disabled={stage !== STAGE_START_ANSWER}>
          作答結束
        </button>
        <br />
        <button onClick={showScore} disabled={stage !== STAGE_REVEAL_ANSWER}>
          顯示排行榜
        </button>
      </div>
      <div>
        <div>報名人數: {players.length}</div>
        <div>題目: {question ? question.text : ''}</div>
        {
          stage === STAGE_START_ANSWER &&
          <div>選項：
          <ul>{options.map(option => <li>{option.text}</li>)}</ul>
          </div>
        }
        {stage === STAGE_REVEAL_ANSWER && <div>答案: {answer.text}</div>}
      </div>
    </div>
  )
}

function Adm(props) {
  const {
    login,
    mode,
    stage,
    players,
    question,
    options,
    answer,
    rank,
    adminLogin,
    startQuestion,
    startAnswer,
    revealAnswer,
    showScore,
    changeMode
  } = props;
  if (!login) {
    return <Login adminLogin={adminLogin} />;
  }
  return (
    <div>
      {mode === 1 && <button onClick={() => changeMode(0)}>切換到遊戲</button>}
      {mode === 0 && <button onClick={() => changeMode(1)}>切換到輪播</button>}
      {
        mode === 0 &&
        <GameAdm
          stage={stage}
          players={players}
          question={question}
          options={options}
          answer={answer}
          rank={rank}
          startQuestion={startQuestion}
          startAnswer={startAnswer}
          revealAnswer={revealAnswer}
          showScore={showScore} />
      }
    </div>
  );
}

export default Adm;