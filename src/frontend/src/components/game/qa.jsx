import React from 'react';
import { Container, Header, Content } from './common';
import { GameStage } from '../../constants';
import styles from './game.css';
import Profile from './profile';

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
      style={{ cursor: 'pointer', flex: 1, margin: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center', whiteSpace: 'initial' }}
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
    <div
      className="d-flex justify-content-center align-items-center mb-0"
      style={{ flex: 3 }}>
      <h4>{question.text}</h4>
    </div>
  )
}

function ProgressBar(props) {
  const { intervalMs, stage } = props;
  const transitionTime = stage === GameStage.START_ANSWER ? intervalMs : 0;
  let progress = 0;
  if (stage === GameStage.START_ANSWER) {
    progress = 100;
  } else if (stage === GameStage.REVEAL_ANSWER) {
    progress = 101;
  }
  return (
    <div className="progress" style={{ height: '0.4rem' }}>
      <div
        className="progress-bar progress-bar-striped progress-bar-animated"
        role="progressbar"
        style={{ width: `${progress}%`, transition: `width ${transitionTime}ms linear` }}>
      </div>
    </div>
  )
}

class Ready extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      suffix: '..'
    }
    this.tick = null;
  }
  componentDidMount() {
    this.tick = setInterval(() => {
      this.setState(({ suffix }) => {
        if (suffix === '...') {
          return { suffix: '' }
        } else {
          return { suffix: `${suffix}.` };
        }
      })
    }, 800)
  }
  componentWillUnmount() {
    clearInterval(this.tick);
  }
  render() {
    const { suffix } = this.state;
    return <h3>{`Ready${suffix}`}</h3>
  }
}

function Overlay(props) {
  const { stage } = props;
  if (stage === GameStage.START_QUESTION || stage === GameStage.REVEAL_ANSWER) {
    return (
      <div
        className="w-100 h-100 position-absolute"
        style={{ top: 0, left: 0, zIndex: 999999, background: '#FFFFF' }}>
        <div
          className="d-flex justify-content-center align-items-center h-100">
          {stage === GameStage.START_QUESTION ? <Ready /> : <h3>Time's up!!</h3>}
        </div>
      </div>
    );
  }
  return null;
}

function QA(props) {
  const {
    stage,
    question,
    options,
    curVote,
    answers,
    player: { id },
    players,
    selectOption,
    intervalMs
  } = props;
  const player = players.find(p => p.id === id);
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
    (stage === GameStage.START_ANSWER && curVote) ||
    (stage === GameStage.REVEAL_ANSWER);
  const showAnswer = stage === GameStage.REVEAL_ANSWER;
  const showOption = stage !== GameStage.START_QUESTION;
  return (
    <Container>
      <Header hideBottomBorder>
        <h3 className="mb-0">
          <small><i className="fas fa-question-circle"></i></small>
          {` 題目 `}
          <small><i className="fas fa-question-circle"></i></small>
        </h3>
        <Profile player={player} />
        <ProgressBar stage={stage} intervalMs={intervalMs} />
      </Header>
      <Content>
        <div className="row h-100 pl-1 pr-1">
          <div className="offset-md-2 col-md-8 col-sm-12 d-flex flex-column h-100">
            <QuestionBlock question={question} />
            <div className="d-flex flex-column position-relative" style={{ flex: 7 }}>
              <Overlay stage={stage} />
              <div className={styles.optionBlock}>
                {
                  options.slice(0, 2).map((option, i) => (
                    <Option
                      order={i}
                      key={option.id}
                      showAnswer={showAnswer}
                      isAnswer={showAnswer && answers.indexOf(option.id) !== -1}
                      isSelect={curVote && curVote.optionId === option.id}
                      disabled={disabled}
                      onClick={() => disabled ? null : selectOption(option.id)}
                      text={showOption ? option.text : ''}>
                    </Option>
                  ))
                }
              </div>
              <div className={styles.optionBlock}>
                {
                  options.slice(2, 4).map((option, i) => (
                    <Option
                      order={i + 2}
                      key={option.id}
                      showAnswer={showAnswer}
                      isAnswer={showAnswer && answers.indexOf(option.id) !== -1}
                      isSelect={curVote && curVote.optionId === option.id}
                      disabled={disabled}
                      onClick={() => disabled ? null : selectOption(option.id)}
                      text={showOption ? option.text : ''}>
                    </Option>
                  ))
                }
              </div>
            </div>
          </div>
        </div>
      </Content>
    </Container>
  )
}

export default QA;