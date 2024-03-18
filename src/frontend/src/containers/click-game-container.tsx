import React, { useCallback } from 'react';
import View from '../components/click-game';
import { useSelector, useDispatch } from 'react-redux';

export default React.memo(() => {
  const dispatch = useDispatch();
  const state = useSelector((state: RootState) => state.clickGame.state);
  const name = useSelector((state: RootState) => state.clickGame.name);
  const tableId = useSelector((state: RootState) => state.clickGame.tableId);

  const onRegister = useCallback(async (args) => {
    dispatch(setState('loading'));
    axios('/asdad/asdasd/sad')
      .then(() => {
        dispatch(setState('!loading'))

      })
  }, []);

  const onClick = useCallback((args: { clicks: number }) => {
    io.emit('click', { clicks: 3, name });
  }, [name]);

  return <View
    state={state}
    name={name}
    tableId={tableId}
    onRegister={onRegister}
    onClick={onClick} />

});