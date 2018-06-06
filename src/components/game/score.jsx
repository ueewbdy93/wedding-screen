import React from 'react';
import { Container, Header, Content } from './common';
import './score.css';

function score(props) {
  const { player, rank } = props;
  const myRankIndex = rank.findIndex(entry => entry.id === player.id);
  const myRank = rank[myRankIndex];
  const top10 = rank.slice(0, 10);
  return (
    <Container>
      <Header title="排行榜"></Header>
      <Content>
        <table className="score">
          <tbody>
            <tr><td><small>名次</small></td><td><small>名字</small></td><td><small>分數</small></td></tr>
            {
              top10.map((playerScore, i) => (
                <tr key={i} className={i === myRankIndex ? 'me' : ''}>
                  <td>{i + 1}</td>
                  <td>{playerScore.name.length > 8 ? `${playerScore.name.slice(0, 8)}...` : playerScore.name}</td>
                  <td>{playerScore.score}</td>
                </tr>
              ))
            }
            {myRankIndex > 10 && <tr><td colSpan={3}>...</td></tr>}
            {myRankIndex >= 10 && <tr className="me"><td>{myRankIndex + 1}</td><td>{myRank.name}</td><td>{myRank.score}</td></tr>}
          </tbody>
        </table>
      </Content>
    </Container>
  )
}

export default score;