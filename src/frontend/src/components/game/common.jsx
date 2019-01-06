import React from 'react';

export function Container({ children }) {
  return (
    <div
      className="position-fixed w-100 h100"
      style={{ top: '0px', left: '0px', right: '0px', bottom: '0px' }}>
      {children}
      <footer className="position-fixed w-100" style={{ bottom: '0px' }}>
        <small>Power by dy93 & ueewbd
          <a
            href="https://github.com/ueewbdy93/wedding-screen"
            rel="noopener noreferrer" target="_blank">
            <i className="text-dark ml-1 fab fa-github"></i>
          </a>
        </small>
      </footer>
    </div>
  );
}

export function Header({ children, hideBottomBorder }) {
  const style = { top: '0px', height: '70px' };
  if (!hideBottomBorder) {
    style.borderBottom = '.4rem solid #e9ecef';
  }
  return (
    <header
      className="align-items-center position-fixed w-100 d-flex justify-content-center"
      style={style}>
      <div className="w-100">{children}</div>
    </header>
  );
}

export function Content({ children }) {
  return (
    <main
      className="position-fixed w-100 position-fixed w-100 d-flex flex-column justify-content-center"
      style={{ top: '70px', bottom: '30px' }}>
      {children}
    </main>
  )
}
