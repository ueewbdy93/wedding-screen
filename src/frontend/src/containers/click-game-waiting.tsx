import React, { useEffect, useState } from 'react';

import View, { IProps } from '../components/click-game/waiting';
export default React.memo(() => {
  const [players, setPlayers] = useState<IProps['players']>([]);
  useEffect(() => {
    const interval = setInterval(() => {
      setPlayers((prev) => {
        const tableId = Math.floor(Math.random() * 20).toString();
        return prev.concat({
          tableId,
          tableName: `第${tableId}桌`,
          name: '小明'
        })
      })
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return <View players={players} />;
});