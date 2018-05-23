import React from 'react';

const STYLE = { height: '100%', width: '100%' };

function profile(props) {
  const { player, rank } = props;
  const myRank = rank.find(entry => entry.id === player.id);
  return (
    <table style={STYLE}>
      <tbody>
        <tr>
          <td style={{ verticalAlign: 'middle' }}>
            {player.name} / {myRank ? myRank.score : 0}
          </td>
        </tr></tbody>
    </table>
  );
}

export default profile;