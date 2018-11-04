import React from 'react';
import { Container, Header, Content } from './common';
import { GameStage } from '../../constants';
import styles from './game.css';

const ORDER = [
  'btn btn-lg btn-info',
  'btn btn-lg btn-success',
  'btn btn-lg btn-danger',
  'btn btn-lg btn-warning'
];

function Option(props) {
  const { order, text, isSelect, isAnswer, onClick, disabled, showAnswer } = props;
  return (
    <div className={`${ORDER[order]} ${isSelect ? styles.selected2 : ''} ${disabled ? 'disabled' : ''}`}
      style={{ cursor: 'pointer', flex: 1, margin: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      disabled={disabled}
      onClick={onClick}>
      <h4>
        {
          showAnswer && <i className={isAnswer ? "far fa-check-circle" : "far fa-times-circle"}></i>
        }
        {`  ${text}`}
      </h4>
    </div>
  )
}

function QuestionBlock({ question }) {
  return (
    <div style={{ alignItems: 'stretch', flex: 3, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <h4>{question.text}</h4>
    </div>
  )
}

function ProgressBar(props) {
  const { intervalMs, progress, stage } = props;
  return (
    <div className="progress" style={{ height: '0.25rem' }}>
      <div
        className="progress-bar progress-bar-striped progress-bar-animated"
        role="progressbar"
        style={{ width: `${progress}%`, transition: `width ${intervalMs || 8000}ms linear` }}>
      </div>
      <div
        className="progress-bar progress-bar-striped progress-bar-animated"
        role="progressbar"
        style={{ width: '100%', display: stage === GameStage.REVEAL_ANSWER ? 'unset' : 'none' }}>
      </div>
    </div>
  )
}


class QA extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: 0
    };
    this.total = 8000;
    this.tick = null;
  }

  componentWillReceiveProps(nextProps, nextState) {
    const currentStage = this.props.stage;
    const nextStage = nextProps.stage;
    if (currentStage !== nextStage) {
      if (nextStage === GameStage.START_ANSWER) {
        this.setState({ progress: 100 });
      } else if (nextStage === GameStage.REVEAL_ANSWER) {
        this.setState(() => ({ progress: 100 }));
      } else if (nextStage === GameStage.START_QUESTION) {
        this.setState(() => ({ progress: 0 }));
      }
    }
  }

  render() {
    const {
      stage,
      question,
      options,
      selectedOption,
      answer,
      rank,
      player,
      selectOption,
      intervalMs
    } = this.props;
    const { progress } = this.state;
    const myRankIndex = rank.findIndex(entry => entry.id === player.id);
    if (options.length === 0) {
      options.push(
        { id: 0, text: '' },
        { id: 1, text: '' },
        { id: 2, text: '' },
        { id: 3, text: '' }
      )
    }
    const disabled =
      (stage === GameStage.START_QUESTION) ||
      (stage === GameStage.START_ANSWER && selectedOption) ||
      (stage === GameStage.REVEAL_ANSWER);
    const showAnswer = stage === GameStage.REVEAL_ANSWER;
    const showOption = stage !== GameStage.START_QUESTION;
    return (
      <Container>
        <Header hideBottomBorder>
          <h3 className="masthead-brand">
            開始作答
          </h3>
          <small>您的大名: {player.name} | 分數: {myRankIndex === -1 ? 0 : rank[myRankIndex].score} | 目前名次: {myRankIndex ? 'N/A' : myRankIndex + 1}</small>
        </Header>
        <ProgressBar stage={stage} intervalMs={intervalMs} progress={progress} />
        <Content fullHeight>
          <div style={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
            <QuestionBlock question={question} />
            <div style={{ flex: 7, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
                {
                  options.slice(0, 2).map((option, i) => (
                    <Option
                      order={i}
                      key={option.id}
                      showAnswer={showAnswer}
                      isAnswer={showAnswer ? answer.id === option.id : false}
                      isSelect={selectedOption === option.id}
                      disabled={disabled}
                      onClick={() => disabled ? null : selectOption(option.id)}
                      text={showOption ? option.text : ''}>
                    </Option>
                  ))
                }
              </div>
              <div style={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
                {
                  options.slice(2, 4).map((option, i) => (
                    <Option
                      order={i + 2}
                      key={option.id}
                      showAnswer={showAnswer}
                      isAnswer={showAnswer ? answer.id === option.id : false}
                      isSelect={selectedOption === option.id}
                      disabled={disabled}
                      onClick={() => disabled ? null : selectOption(option.id)}
                      text={showOption ? option.text : ''}>
                    </Option>
                  ))
                }
              </div>
            </div>
          </div>
        </Content>
      </Container>
    )
  }
}

export default QA;