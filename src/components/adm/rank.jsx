import React from 'react';

function Rank(props) {
  const { rank } = props;
  return (
    <div>
      <div>
        {
          <table>
            <thead><tr><th colSpan={3}>排行榜</th></tr></thead>
            <tbody>{
              rank.map((player, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
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