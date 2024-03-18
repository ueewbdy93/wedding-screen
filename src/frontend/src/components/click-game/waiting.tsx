import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Chip from '@mui/material/Chip';
import FaceIcon from '@mui/icons-material/Face';

interface IPlayer {
  readonly name: string;
  readonly tableId: string;
  readonly tableName: string;
}

export interface IProps {
  readonly players: readonly IPlayer[]
}

export default React.memo(function Waiting(props: IProps) {
  const { players } = props;

  const tablePlayers = players.reduce((acc, player) => {
    const { tableId } = player;
    let table = acc.get(tableId) ?? {
      tableName: player.tableName,
      count: 0
    };
    table.count += 1;
    acc.set(tableId, table);
    return acc;
  }, new Map<string, { tableName: string; count: number }>());

  return <Container sx={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
    <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px' }}>
      {
        Array.from(tablePlayers.values()).sort((a, b) => b.count - a.count).map(({ tableName, count }, i) => (
          <Chip key={i} icon={<FaceIcon />} label={`${tableName}：${count}人`} />
        ))
      }
    </Box>
  </Container>;
});
