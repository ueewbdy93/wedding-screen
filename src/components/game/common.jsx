import React from 'react';

export function Container({ children }) {
  return (
    <div className="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
      {children}
      <footer className="mastfoot mt-auto">
        <div className="inner">
          <small>{`Power by dy93 & ueewbd `}
            <a href="https://github.com/ueewbdy93/wedding-screen" target="_blank">
              <i className="fab fa-github" style={{ color: '#6c757d' }}></i>
            </a>
          </small>
        </div>
      </footer>
    </div>
  );
}

export function Header({ children, hideBottomBorder }) {
  const style = {};
  if (!hideBottomBorder) {
    style.borderBottom = '.4rem solid #e9ecef';
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
