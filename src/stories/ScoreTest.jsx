import React from 'react';
import { action } from '@storybook/addon-actions';
import Score from '../components/game/score';

const rank = [
  { id: 1, name: 'dy93longlonglonglonglongxxxxewgrthyrh', score: 100000 },
  { id: 2, name: '寶寶名字好長好長好長', score: 50000 },
  { id: 3, name: '彼得', score: 10000 },
  { id: 4, name: '小天', score: 9999 },
  { id: 5, name: 'ueewbd', score: 8700 },
  { id: 6, name: 'lisa', score: 2400 },
  { id: 7, name: 'pauline', score: 1000 },
  { id: 8, name: '溫蒂', score: 500 },
  { id: 9, name: '林克', score: 124 },
  { id: 10, name: '波布克林', score: 123 },
  { id: 11, name: '薩爾達', score: 10 },
  { id: 12, name: '只有一分QQ', score: 1 },
  { id: 13, name: '我是最後一名', score: 0 },
];

export function ScoreTest() {
  return (
    <Score
      rank={rank}
      player={rank[3]}
    />
  )
}

export function ScoreTest2() {
  return (
    <Score
      rank={rank}
      player={rank[10]}
    />
  )
}

export function ScoreTest3() {
  return (
    <Score
      rank={rank}
      player={rank[12]}
    />
  )
}
