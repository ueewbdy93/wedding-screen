import React from 'react';
import { Container, Header, Content } from './common';

function score(props) {
  const { player, rank } = props;
  const myRankIndex = rank.findIndex(entry => entry.id === player.id);
  const myRank = rank[myRankIndex];
  const top10 = rank.slice(0, 10);
  return (
    <Container>
      <Header>
        <h3 className="masthead-brand">
          <small><i className="fas fa-trophy"></i></small>
          {` 排行榜 `}
          <small><i className="fas fa-trophy"></i></small>
        </h3>
        <small>您的大名: {player.name} | 分數: {myRank ? myRank.score : 0} | 名次: {myRankIndex ? myRankIndex + 1 : 'N/A'}</small>
      </Header>
      <Content>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <table className="table table-striped table-lg" style={{ maxWidth: '42em' }}>
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
                  <tr key={i} className={i === myRankIndex ? 'bg-info' : ''}>
                    <th scope="row">{i + 1}</th>
                    <td>{playerScore.name}</td>
                    <td>{playerScore.score}</td>
                  </tr>
                ))
              }
              {myRankIndex > 10 && <tr><td colSpan={3}>...</td></tr>}
              {myRankIndex >= 10 && <tr className="bg-info"><th scope="row">{myRankIndex + 1}</th><td>{myRank.name}</td><td>{myRank.score}</td></tr>}
            </tbody>
          </table>
        </div>
      </Content>
    </Container>
  )
}

export default score;