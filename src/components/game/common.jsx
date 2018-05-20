import React from 'react';
import Transition from 'react-transition-group/Transition';
import CenterText from './centerText';
import './game.css';

export function Container({ children }) {
  return (<div className="game-container">{children}</div>);
}

export function Header({ title, children }) {
  return (
    <div className="header">
      <div className="title">
        {title ? <CenterText text={title} /> : children}
      </div>
      <div className="bar"></div>
    </div>
  );
}

export function Content({ children }) {
  return (<div className="content">{children}</div>);
}

export function QuestionBlock({ question }) {
  return (<div className="question"><CenterText text={question.text} /></div>)
}

export function OptionBlock({ children }) {
  return (<div className="option-block">{children}</div>);
}

export function Option({ children, isSelect, isAnswer, onClick }) {
  return (
    <button
      onClick={onClick}
      className={isSelect ? 'selected option' : 'option'}>
      {isAnswer && <i className="fas fa-check" style={{ marginRight: '5px' }}></i>}
      {children}
    </button>
  )
}

// export function Option({ option, onClick, isAnswer, isSelect }) {
//   return (
//     <button
//       disabled={option.disabled}
//       className="option"
//       onClick={onClick.bind(option.id)}>
//       {`${isAnswer ? '[正解]' : ''} ${isSelect ? '[x]' : '[]'} ${option.text}`}
//     </button>
//   )
// }


const duration = 500;

const defaultStyle = {
  width: '100%',
  transition: `opacity ${duration}ms ease-in-out`,
  opacity: 1,
}

const transitionStyles = {
  entering: { opacity: 0 },
  entered: { opacity: 1 }
};

export function OptionBlockOverlay({ text, onEntered }) {
  return (
    <div className="overlay">
      <CenterText>
        <Transition in appear timeout={duration} onEntered={onEntered}>
          {(state) => (
            <p style={{
              ...defaultStyle,
              ...transitionStyles[state]
            }}>
              {text}
            </p>
          )}
        </Transition>
      </CenterText>
    </div >
  )
}