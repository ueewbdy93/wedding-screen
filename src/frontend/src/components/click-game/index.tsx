import React, { useState } from 'react';
import Register from './register';

const TABLES = new Array(10).fill(0).map((_, i) => ({ id: i.toString(), name: `第${i + 1}桌` }));


export interface IProps {
  readonly state: 'register' | 'playing' | 'end';
  readonly name: string;
  readonly tableId: string;

  readonly onRegister: (args: { name: string; tableId: string }) => void;
  readonly onClick: () => void;

}

export default React.memo(function ClickGame(props: IProps) {
  const { state, name, tableId, onRegister } = props;

  if (name === '' || tableId === '') {
    return <Register tables={TABLES} onSubmit={onRegister} />
  }

  if (state === 'register') {
    // 可能是一堆名字的畫面
    return <Waiting />
  } else if (state === 'playing' || state === 'playing2') {
    return <Playing onClick={onClick} disabled={state === 'playing2'} />
  } else if (state === 'end') {
    return <End />
  }
});
