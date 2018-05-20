import React from 'react';

const STYLE = { height: '100%', width: '100%', textAlign: 'center' };

function CenterText({ text, children }) {
  return (
    <table style={STYLE}>
      <tbody><tr><td style={{ verticalAlign: 'middle' }}>{text || children}</td></tr></tbody>
    </table>
  )
}

export default CenterText;