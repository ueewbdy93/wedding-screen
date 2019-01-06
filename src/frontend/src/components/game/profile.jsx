import React from 'react';

function Profile(props) {
  const { player, short = false } = props;
  return (
    <small>
      {
        !short &&
        <span className="mr-2">
          <small><i className="mr-1 fas fa-user"></i></small>
          {player.name}
        </span>
      }
      {
        !short &&
        <span className="mr-2">
          <small><i className="mr-1 fas fa-award"></i></small>
          {player.state === 0 ? 'N/A' : player.rank}
        </span>
      }
      <span className="mr-2">
        <small><i className="mr-1 fas fa-star"></i></small>
        {player.score}
      </span>
      <span className="mr-2">
        <small><i className="mr-1 fas fa-check-circle"></i></small>
        {player.correctCount}
      </span>
      <span className="mr-2">
        <small><i className="mr-1 fas fa-times-circle"></i></small>
        {player.incorrectCount}
      </span>
      <span className="mr-2">
        <small><i className="mr-1 fas fa-clock"></i></small>
        {player.time === 0 ? 'N/A' : `${player.time / 1000}s`}
      </span>
    </small>
  );
}

export default Profile;