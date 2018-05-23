import React from 'react';
import QA from '../components/game/qa';
import { action } from '@storybook/addon-actions';

const question = {
  id: 1,
  text: 'Q1: blablablalbla...'
}

const options = [
  { id: 1, text: '選項1' },
  { id: 2, text: '選項2' },
  { id: 3, text: '選項3' },
  { id: 4, text: '選項4' }
]

const rank = [
  { id: 1, name: 'dy93', score: 100000 },
  { id: 2, name: '寶寶', score: 50000 },
  { id: 3, name: '彼得', score: 10000 },
  { id: 4, name: '小天', score: 9999 },
  { id: 5, name: 'ueewbd', score: 8700 },
  { id: 6, name: 'lisa', score: 2400 },
  { id: 7, name: 'pauline', score: 1000 },
  { id: 8, name: '溫蒂', score: 500 },
  { id: 9, name: '林克', score: 124 },
  { id: 10, name: '波布克林', score: 123 },
  { id: 11, name: '薩爾達', score: 10 },
]

const player = { id: 4, name: '小天', score: 9999 };

class QaTest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stage: 'START_QUESTION',
      selectOption: null,
      answer: null
    }
    this.startQuestion = this.startQuestion.bind(this);
    this.startAnswer = this.startAnswer.bind(this);
    this.revealAnswer = this.revealAnswer.bind(this);
    this.onOptionSelect = this.onOptionSelect.bind(this);
  }
  onOptionSelect(id) {
    this.setState({ selectOption: id });
  }
  revealAnswer() {
    this.setState({ stage: 'REVEAL_ANSWER', answer: { id: 3, text: 'option 3' } })
  }
  startQuestion() {
    this.setState({ stage: 'START_QUESTION', answer: null, selectOption: null })
  }
  startAnswer() {
    this.setState({ stage: 'START_ANSWER' })
  }
  render() {
    const { stage, answer } = this.state;
    return (
      <div>
        <div style={{ width: '300px', height: '50px' }}>
          <button onClick={this.startQuestion}>startQuestion</button>
          <button onClick={this.startAnswer}>startAnswer</button>
          <button onClick={this.revealAnswer}>revealAnswer</button>
        </div>
        <div style={{ position: 'relative', width: '200px', height: '400px' }}>
          <QA
            player={player}
            rank={rank}
            answer={answer}
            stage={stage}
            question={question}
            options={options}
            selectOption={this.state.selectOption}
            onOptionSelect={this.onOptionSelect}
          />
        </div>
      </div>
    )
  }
}

export default QaTest;