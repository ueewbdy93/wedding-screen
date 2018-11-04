import React from 'react';

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