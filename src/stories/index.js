import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

import { Button, Welcome } from '@storybook/react/demo';


import JoinListTest from './JoinListTest';
import NameInputTest from './NameInputTest';
import QaTest from './QaTest';
import { ScoreTest, ScoreTest2, ScoreTest3 } from './ScoreTest'

storiesOf('Welcome', module).add('to Storybook', () => <Welcome showApp={linkTo('Button')} />);

storiesOf('Game', module)
  .add('輸入名字', () => <NameInputTest />)
  .add('等待加入', () => <JoinListTest />)
  .add('作答', () => <QaTest />)
  .add('排行榜', () => <ScoreTest />)
  .add('排行榜2', () => <ScoreTest2 />)
  .add('排行榜3', () => <ScoreTest3 />)

storiesOf('font awsome', module)
  .add('test', () => <div>
    <i className="fas fa-trophy"><small>1</small></i> dddd<br />
    <i className="fas fa-trophy">2</i> oooo<br />
    <i className="fas fa-trophy">3</i> xxxxx
    </div>);

storiesOf('Button', module)
  .add('with text', () => <Button onClick={action('clicked')}>Hello Button</Button>)
  .add('with some emoji', () => <Button onClick={action('clicked')}>😀 😎 👍 💯</Button>);
