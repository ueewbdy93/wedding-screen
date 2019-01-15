import React from 'react';
import { Container, Header, Content } from './common';
import { GameStage } from '../../constants';
import Profile from './profile';
import CountUp from 'react-countup';


const BG = [
  'bg-info',
  'bg-success',
  'bg-danger',
  'bg-warning'
];

function Option(props) {
  const { order, text, isSelect, isAnswer, onClick, showAnswer, total, count } = props;
  const classes = [showAnswer && !isAnswer ? 'bg-secondary' : BG[order]];
  if (showAnswer) {
    classes.push('progress-bar-striped')
  }
  const percent = Math.round(count / total * 100);
  return (
    <div className="bg-light shadow rounded m-2 position-relative d-flex justify-content-center align-items-center"
      style={{ cursor: 'pointer', flex: 1, whiteSpace: 'initial' }}
      onClick={onClick}>
      <div
        className={`${classes.join(' ')} btn position-absolute h-100`}
        style={{
          opacity: 0.7,
          left: 0, width: showAnswer ? `${percent || 0}%` : '100%',
          transition: `width ${showAnswer ? '500ms' : '0ms'} ease-in 900ms, background 200ms ease-in`,
          transitionDelay: '200ms'
        }}>

      </div>
      <h4 className="w-100 mb-0" style={{ zIndex: 1 }}>
        {!showAnswer && isSelect && <i className="fas fa-hand-point-right mr-1"></i>}
        {
          showAnswer && total !== count &&
          <CountUp className="badge badge-pill"
            delay={0.9} duration={0.5} end={count} start={total} />
        }
        {
          showAnswer && total === count &&
          <span className="badge badge-pill">{count}</span>
        }
        {text}
      </h4>
    </div>
  );
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
  }
  return (
    <div className="progress" style={{ height: '0.4rem' }}>
      <div
        className="progress-bar progress-bar-striped progress-bar-animated"
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
  if (stage === GameStage.START_QUESTION) {
    return (
      <div
        className="w-100 h-100 position-absolute"
        style={{ zIndex: 999999, background: '#FFFFF' }}>
        <div
          className="d-flex justify-content-center align-items-center h-100">
          {stage === GameStage.START_QUESTION && <Ready />}
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
    intervalMs,
    questionIndex,
    playerVotes,
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
  const total = players.length;
  const counts = Object.keys(playerVotes).reduce((count, key) => {
    const { optionId } = playerVotes[key];
    if (!count[optionId]) {
      count[optionId] = 0;
    }
    count[optionId]++;
    return count;
  }, {});
  return (
    <Container>
      <Header hideBottomBorder>
        <h3 className="mb-0">
          <small><i className="fas fa-question-circle"></i></small>
          {` 題目 `}
          <small><i className="fas fa-question-circle"></i></small>
        </h3>
        <Profile player={player} questionIndex={questionIndex} />
        <ProgressBar stage={stage} intervalMs={intervalMs} />
      </Header>
      <Content>
        <div className="row h-100 pl-3 pr-3">
          <div className="offset-md-2 col-md-8 offset-lg-3 col-lg-6 col-sm-12 d-flex flex-column h-100">
            <QuestionBlock question={question} />
            <div className="position-relative" style={{ flex: 7 }}>
              <Overlay stage={stage} />
              <div className="h-100 w-100 d-flex flex-column">
                {
                  options.map((option, i) => (
                    <Option
                      total={total}
                      count={counts[option.id] || 0}
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
            </div>
          </div>
        </div>
      </Content>
    </Container>
  )
}

export default QA;