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

function GameStatus(props) {
  const {
    players,
    options,
    question,
    selectedCount,
    playerAnswers,
    answer
  } = props;
  const options2 = (!options || options.length === 0) ?
    Array(4).fill(0).map(() => ({ text: '' })) : options;
  const total = players.length;
  const finalCount = Object.keys(playerAnswers).reduce((count, key) => {
    const { optionID } = playerAnswers[key];
    if (!count[optionID]) {
      count[optionID] = 0;
    }
    count[optionID]++;
    return count;
  }, {});
  return (
    <div>
      <h4>Q. {question ? question.text : ''}</h4>
      <div>{
        options2.map((option, i) => {
          const { text, id } = option;
          const count = finalCount[id] ? finalCount[id] : (selectedCount[id] || 0);
          const progress = id && total ? Math.round(count / total * 100) : 0;
          const isAnswer = answer && answer.id === id;
          return (
            <div key={i} className="progress" style={{ height: 'unset' }}>
              <div
                className={PROGRESS_BAR_CLASS[i]}
                style={{ width: `${progress}%` }}>
                <h5 style={{ margin: '5px 0px' }}>
                  {isAnswer && <i className="far fa-check-circle"></i>}
                  {` ${text}: ${count}`}
                </h5>
              </div>
            </div>
          )
        })
      }<small>總人數: {total}</small>
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
    this.state = {
      selectedCount: {}
    }
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.stage !== nextProps.stage) {
      if (nextProps.stage === GameStage.START_QUESTION) {
        this.setState({ selectedCount: {} });
      }
    }
    if (this.props.vote !== nextProps.vote && nextProps.vote !== null) {
      if (this.props.vote) {
        const { playerID: lastPlayerID } = this.props.vote;
        const { playerID: curPlayerID } = nextProps.vote;
        if (lastPlayerID === curPlayerID) {
          return;
        }
      }

      const { optionId } = nextProps.vote;
      this.setState((preState) => {
        const selectedCount = { ...preState.selectedCount }
        if (!selectedCount[optionId]) {
          selectedCount[optionId] = 0;
        }
        selectedCount[optionId]++;
        return { selectedCount };
      })
    }
  }
  render() {
    const { selectedCount } = this.state;
    const {
      stage,
      players,
      question,
      options,
      answer,
      playerAnswers = {},
      startQuestion,
      startAnswer,
      revealAnswer,
      showScore,
      selectedTab,
      rank,
      intervalMs
    } = this.props;
    if (selectedTab === 'rank') {
      return <Rank rank={rank} />;
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
          selectedCount={selectedCount}
          answer={answer}
          options={options}
          players={players}
          question={question}
          playerAnswers={playerAnswers} />
      </div>
    );
  }

}

export default GameMgr;