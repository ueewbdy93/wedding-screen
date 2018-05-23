import React from 'react';
import { Container, Header, Content, OptionBlock, Option, QuestionBlock, OptionBlockOverlay } from './common';
import Profile from './profile';
import { GameStage } from '../../constants';

function LockedOption(props) {
  return (
    <OptionBlock>
      <Option />
      <Option />
      <Option />
      <Option />
      <OptionBlockOverlay text="準備..."></OptionBlockOverlay>
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
    const { selectedOption, selectOption, options, answer, locked } = this.props;
    return (
      <OptionBlock>
        {
          options.map(option => (
            <Option
              key={option.id}
              isAnswer={answer && answer.id === option.id}
              isSelect={selectedOption === option.id}
              disabled={locked}
              onClick={() => selectOption(option.id)}>
              {option.text}
            </Option>
          ))
        }
        {
          (selectedOption || locked) &&
          <OptionBlockOverlay text={locked ? '嗶嗶~時間到!' : ''}></OptionBlockOverlay>
        }
        {
          (!locked && showOverlay) &&
          <OptionBlockOverlay text="開始作答!" onEntered={this.onTransitionEntered}></OptionBlockOverlay>
        }
      </OptionBlock >
    )
  }

}

function ShowOptionBlock(props) {
  const {
    stage,
    selectedOption,
    options,
    answer,
    selectOption,
  } = props;
  switch (stage) {
    case GameStage.START_QUESTION:
      return <LockedOption />;
    case GameStage.START_ANSWER:
      return (
        <EnabledOption
          locked={false}
          selectedOption={selectedOption}
          selectOption={selectOption}
          options={options} />
      );
    case GameStage.REVEAL_ANSWER:
      return (
        <EnabledOption
          locked={true}
          answer={answer}
          selectOption={() => { }}
          selectedOption={selectedOption}
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
      selectedOption,
      answer,
      rank,
      player,
      selectOption
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
            selectedOption={selectedOption}
            selectOption={selectOption} />
        </Content>
      </Container>
    )
  }
}

export default QA;