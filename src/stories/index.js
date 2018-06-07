import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import Score from '../components/game/score';
import Slideshow from '../components/slideshow';

storiesOf('slideshow', module)
  .add('slideshow', () => (
    <Slideshow
      index={0}
      pictures={[
        'https://media.istockphoto.com/photos/interracial-couple-holding-hands-at-wedding-picture-id494698184?k=6&m=494698184&w=0&h=Ud6a83YwaNFy0PC-RZsxS8VrM74Si0iOw_z5ok1Glio=',
        'https://media.istockphoto.com/photos/feet-of-bride-and-groom-wedding-shoes-picture-id504615172?k=6&m=504615172&w=0&h=b8ujMX5ErMExlKfbBbEhdcpCm3M3F0pHqldyTdkfRNk='
      ]}
      newComment={null}
      addComment={action('addComment')} />
  ));

const rank = [
  { id: '1', score: 100, name: 'player1' },
  { id: '2', score: 99, name: 'player2' },
  { id: '3', score: 98, name: 'player3' },
  { id: '4', score: 97, name: 'player4' },
  { id: '5', score: 96, name: 'player5' },
  { id: '6', score: 95, name: 'player6' },
  { id: '7', score: 94, name: 'player7' },
  { id: '8', score: 93, name: 'player8' },
  { id: '9', score: 92, name: 'player9' },
  { id: '10', score: 91, name: 'player10' },
  { id: '11', score: 90, name: 'player11' },
  { id: '12', score: 89, name: 'player12' },
];

storiesOf('排行榜', module)
  .add('前10名', () => <Score rank={rank} player={rank[0]} />)
  .add('第11名', () => <Score rank={rank} player={rank[10]} />)
  .add('11名以後', () => <Score rank={rank} player={rank[11]} />);
