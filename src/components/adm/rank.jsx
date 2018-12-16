import React from 'react';

function Rank(props) {
  const { players } = props;
  return (
    <div>
      <div>
        {
          <table>
            <thead><tr><th colSpan={3}>排行榜</th></tr></thead>
            <tbody>{
              players.map((player) => (
                <tr key={player.id}>
                  <td>{player.rank}</td>
                  <td>{player.name}</td>
                  <td>{player.score}</td>
                </tr>
              ))
            }</tbody>
          </table>
        }
      </div>
    </div>
  )
}

export default Rank;