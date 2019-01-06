import React from 'react';
import { GameStage } from '../../constants';
import Rank from './rank';
import './admin.css';

const PROGRESS_BAR_CLASS = [
  'progress-bar progress-bar-animated progress-bar-striped bg-info',
  'progress-bar progress-bar-animated progress-bar-striped bg-success',
  'progress-bar progress-bar-animated progress-bar-striped bg-danger',
  'progress-bar progress-bar-animated progress-bar-striped bg-warning',
];

function PlayerVoteBar(props) {
  const { order, count = 0, progress = 0, isAnswer = false, text = '?' } = props;
  return (
    <div key={order} className="progress" style={{ height: 'unset' }}>
      <div
        className={PROGRESS_BAR_CLASS[order]}
        style={{ width: `${progress ? progress : 0}%` }}>
        <h5 style={{ margin: '5px 0px' }}>
          {isAnswer && <i className="far fa-check-circle"></i>}
          {` ${text}: ${count}`}
        </h5>
      </div>
    </div>
  )
}

function GameStatus(props) {
  const {
    players,
    question,
    playerVotes,
  } = props;
  const total = players.length;
  const counts = Object.keys(playerVotes).reduce((count, key) => {
    const { optionId } = playerVotes[key];
    if (!count[optionId]) {
      count[optionId] = 0;
    }
    count[optionId]++;
    return count;
  }, {});
  if (question === null) {
    return <div></div>
  }
  const { options, answers } = question;
  return (
    <div>
      <h4>{question.text}</h4>
      <div>
        {
          options.map((option, i) => {
            const { text, id } = option;
            const count = counts[id] || 0;
            const progress = total !== 0 ? Math.round(count / total * 100) : 0;
            const isAnswer = answers.indexOf(id) !== -1;
            return (
              <PlayerVoteBar
                key={i} order={i} text={text} count={count}
                progress={progress} isAnswer={isAnswer} />
            );
          })
        }
        <small>總人數: {total}</small>
      </div>
    </div>
  )
}

function RevealAnswerButton(props) {
  const { stage, intervalMs, revealAnswer } = props;
  const progress = stage === GameStage.START_ANSWER ? 100 : 0;
  const transitionTime = progress === 0 ? 0 : intervalMs;
  return (
    <button
      style={{ paddingLeft: '0px', paddingRight: '0px', paddingBottom: '0px' }}
      className="list-group-item list-group-item-info"
      onClick={revealAnswer}
      disabled={stage !== GameStage.START_ANSWER}>
      <i className="far fa-clock"></i>{' 結束作答'}
      <div className="progress" style={{ height: '1px', marginTop: '.75rem' }}>
        <div
          className="progress-bar"
          style={{ width: `${progress}%`, transition: `width ${transitionTime}ms linear` }}>
        </div>
      </div>
    </button>
  )
}

function GameButton(props) {
  const {
    startQuestion,
    startAnswer,
    revealAnswer,
    showScore,
    stage,
    intervalMs
  } = props;
  return (
    <div className="list-group">
      <button
        className="list-group-item list-group-item-info"
        onClick={startQuestion}
        disabled={stage !== GameStage.JOIN && stage !== GameStage.SCORE}>
        <i className="far fa-question-circle"></i> {' 顯示題目'}
      </button>
      <button
        className="list-group-item list-group-item-info"
        onClick={startAnswer}
        disabled={stage !== GameStage.START_QUESTION}>
        <i className="far fa-edit"></i>{' 開始作答'}
      </button>
      <RevealAnswerButton
        revealAnswer={revealAnswer}
        stage={stage}
        intervalMs={intervalMs}
      />
      <button
        className="list-group-item list-group-item-info"
        onClick={showScore}
        disabled={stage !== GameStage.REVEAL_ANSWER}>
        <i className="fas fa-trophy"></i>{' 計算分數/排行'}
      </button>
    </div>
  )
}


class GameMgr extends React.Component {
  constructor(props) {
    super(props);
    this.onResetGame = this.onResetGame.bind(this);
  }
  onResetGame() {
    if (window.confirm("確定要重置遊戲？")) {
      this.props.onResetGame()
    }
  }
  render() {
    const {
      stage,
      players,
      playerVotes,
      question,
      startQuestion,
      startAnswer,
      revealAnswer,
      showScore,
      selectedTab,
      intervalMs
    } = this.props;
    if (selectedTab === 'rank') {
      return <Rank players={players} />;
    }
    return (
      <div>
        <GameButton
          stage={stage}
          intervalMs={intervalMs}
          startQuestion={startQuestion}
          startAnswer={startAnswer}
          revealAnswer={revealAnswer}
          showScore={showScore} />
        <hr />
        <GameStatus
          stage={stage}
          players={players}
          question={question}
          playerVotes={playerVotes} />
        <hr />
        <button className="btn btn-link btn-sm" onClick={this.onResetGame}>重置遊戲</button>
      </div>
    );
  }

}

export default GameMgr;