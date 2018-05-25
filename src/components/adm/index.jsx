import React from 'react';
import Login from './login';
import { GameStage } from '../../constants';
import './admin.css';

function GameAdm(props) {
  const {
    stage,
    players,
    question,
    options,
    answer,
    rank,
    playerAnswers = {},
    startQuestion,
    startAnswer,
    revealAnswer,
    showScore
  } = props;
  return (
    <div>
      <div>
        <table>
          <thead>
            <tr><th colSpan={2}>遊戲操作按鈕</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <button onClick={startQuestion} disabled={stage !== GameStage.JOIN && stage !== GameStage.SCORE}>
                  1. 開始題目/下一題
                </button>
              </td>
              <td>
                <button onClick={startAnswer} disabled={stage !== GameStage.START_QUESTION}>
                  2. 開始作答
                </button>
              </td>
            </tr>
            <tr>
              <td>
                <button onClick={revealAnswer} disabled={stage !== GameStage.START_ANSWER}>
                  3. 作答結束(揭曉答案)
                </button>
              </td>
              <td>
                <button onClick={showScore} disabled={stage !== GameStage.REVEAL_ANSWER}>
                  4. 顯示排行榜
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div>
        <div style={{ textAlign: 'right' }}><small>遊戲報名人數: {players.length}</small></div>
        <div><h3>題目: {question ? question.text : ''}</h3></div>
        <div>
          {
            stage >= GameStage.START_ANSWER &&
            <table style={{ width: '100%' }}>
              <thead><tr><th colSpan={3}>選項和作答人數</th></tr></thead>
              <tbody>
                {
                  options.map(option => {
                    const count = Object.keys(playerAnswers).filter(playerId => playerAnswers[playerId].optionID === option.id).length;
                    const isAnswer = answer ? answer.id === option.id : false;
                    return (
                      <tr key={option.id} style={{ color: isAnswer ? 'red' : 'black' }}>
                        <td>{option.text}</td>
                        <td>{count}</td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
          }
        </div>
        <div>
          {
            stage === GameStage.SCORE &&
            <table>
              <thead><tr><th colSpan={3}>排行榜</th></tr></thead>
              <tbody>
                {
                  rank.slice(0, 10).map((player, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{player.name}</td>
                      <td>{player.score}</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          }
        </div>
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
    playerAnswers,
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
      <h3>
        後台
        {mode === 1 && <button style={{ float: 'right', width: 'inherit' }} onClick={() => changeMode(0)}>切換到遊戲</button>}
        {mode === 0 && <button style={{ float: 'right', width: 'inherit' }} onClick={() => changeMode(1)}>切換到輪播</button>}
      </h3>
      {
        mode === 0 &&
        <GameAdm
          stage={stage}
          players={players}
          question={question}
          options={options}
          answer={answer}
          rank={rank}
          playerAnswers={playerAnswers}
          startQuestion={startQuestion}
          startAnswer={startAnswer}
          revealAnswer={revealAnswer}
          showScore={showScore} />
      }
    </div>
  );
}

export default Adm;