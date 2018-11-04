import React from 'react';

const STYLE = { height: '100%', width: '100%', padding: '0px 10px' };

function profile(props) {
  const { player, rank } = props;
  const myRank = rank.find(entry => entry.id === player.id);
  return (
    <h3 className="masthead-brand">
      {player.name} / {myRank ? myRank.score : 0}
    </h3>
  );
}

export default profile;