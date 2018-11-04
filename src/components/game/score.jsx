import React from 'react';
import { Container, Header, Content } from './common';
import styles from './score.css';

function score(props) {
  const { player, rank } = props;
  const myRankIndex = rank.findIndex(entry => entry.id === player.id);
  const myRank = rank[myRankIndex];
  const top10 = rank.slice(0, 10);
  return (
    <Container>
      <Header>
        <h3 className="masthead-brand">排行榜</h3>
        <small>您的名次: {myRankIndex + 1}</small>
      </Header>
      <Content>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <table className="table table-striped table-lg">
            <thead>
              <tr>
                <th scope="col">名次</th>
                <th scope="col">名字</th>
                <th scope="col">分數</th>
              </tr>
            </thead>
            <tbody>
              {
                top10.map((playerScore, i) => (
                  <tr key={i} className={i === myRankIndex ? 'bg-primary' : ''}>
                    <th scope="row">{i + 1}</th>
                    <td>{playerScore.name.length > 8 ? `${playerScore.name.slice(0, 8)}...` : playerScore.name}</td>
                    <td>{playerScore.score}</td>
                  </tr>
                ))
              }
              {myRankIndex > 10 && <tr><td colSpan={3}>...</td></tr>}
              {myRankIndex >= 10 && <tr className="bg-primary"><th scope="row">{myRankIndex + 1}</th><td>{myRank.name}</td><td>{myRank.score}</td></tr>}
            </tbody>
          </table>
        </div>
      </Content>
    </Container>
  )
}

export default score;