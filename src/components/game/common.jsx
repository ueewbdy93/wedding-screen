import React from 'react';
import Transition from 'react-transition-group/Transition';
import CenterText from './centerText';
import styles from './game.css';

export function Container({ children }) {
  return (
    <div className="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
      {children}
      <footer className="mastfoot mt-auto">
        <div className="inner">
          <p>Power by dy93 & ueewbd <i className="fas fa-heart"></i></p>
        </div>
      </footer>
    </div>
  );
}

export function Header({ children, hideBottomBorder }) {
  const style = {};
  if (!hideBottomBorder) {
    style.borderBottom = '.25rem solid #fff';
  }
  return (
    <header className="masthead mb-auto" style={style}>
      <div className="inner">
        {
          children
        }
      </div>
    </header>
  );
}

export function Content({ children, fullHeight }) {
  const style = {};
  if (fullHeight) {
    style.height = '100%';
  }
  return (
    <main role="main" className="container" style={style}>
      {children}
    </main>
  )
}
