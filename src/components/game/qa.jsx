import React from 'react';
import Transition from 'react-transition-group/Transition';
import { Container, Header, Content, OptionBlock, Option, QuestionBlock, OptionBlockOverlay } from './common';
import Profile from './profile';

function LockedOption(props) {
  return (
    <OptionBlock>
      <Option />
      <Option />
      <Option />
      <Option />
      <OptionBlockOverlay text="Ready?"></OptionBlockOverlay>
    </OptionBlock>
  )
}

class EnabledOption extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showOverlay: true
    }
    this.onTransitionEntered = this.onTransitionEntered.bind(this);
  }
  onTransitionEntered() {
    setTimeout(() => {
      this.setState({ showOverlay: false });
    }, 1000)
  }
  render() {
    const { showOverlay } = this.state;
    const { selectOption, onOptionSelect, options, answer, locked } = this.props;
    return (
      <OptionBlock>
        {
          options.map(option => (
            <Option
              key={option.id}
              isAnswer={answer && answer.id === option.id}
              isSelect={selectOption === option.id}
              onClick={() => onOptionSelect(option.id)}>
              {option.text}
            </Option>
          ))
        }
        {
          (selectOption || locked) &&
          <OptionBlockOverlay text=""></OptionBlockOverlay>
        }
        {
          showOverlay &&
          <OptionBlockOverlay text="Go!" onEntered={this.onTransitionEntered}></OptionBlockOverlay>
        }
      </OptionBlock >
    )
  }

}

function ShowOptionBlock(props) {
  const {
    stage,
    selectOption,
    options,
    answer,
    onOptionSelect,
  } = props;
  switch (stage) {
    case 'START_QUESTION':
      return <LockedOption />;
    case 'START_ANSWER':
      return (
        <EnabledOption
          locked={false}
          selectOption={selectOption}
          onOptionSelect={onOptionSelect}
          options={options} />
      );
    case 'REVEAL_ANSWER':
      return (
        <EnabledOption
          locked={true}
          answer={answer}
          selectOption={selectOption}
          options={options} />
      );
    default:
      return null;
  }
}

class QA extends React.Component {
  render() {
    const {
      stage,
      question,
      options,
      selectOption,
      answer,
      rank,
      player,
      onOptionSelect
    } = this.props;
    return (
      <Container>
        <Header>
          <Profile player={player} rank={rank} />
        </Header>
        <Content>
          <QuestionBlock question={question} />
          <ShowOptionBlock
            stage={stage}
            question={question}
            options={options}
            answer={answer}
            selectOption={selectOption}
            onOptionSelect={onOptionSelect} />
        </Content>
      </Container>
    )
  }
}

export default QA;