import React from 'react';
import { Container, Header, Content, OptionBlock, Option, QuestionBlock, OptionBlockOverlay } from './common';

function final(props) {
  const { rank, player } = props;
  const myRank = rank.findIndex(entry => entry.id === player.id);
  if (myRank < 10) {
    return (
      <div>
        <p>恭喜{player.name}獲得第{myRank + 1}名！</p>
        <p>請保留本頁向工作人員領取小禮物喲</p>
      </div>
    );
  }
}

export default final;