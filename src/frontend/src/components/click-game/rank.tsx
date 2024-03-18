import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import React, { useMemo } from 'react';


const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 40,
  borderRadius: 0,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
    ['&:after']: {
      content: 'attr(data-count)',
    }
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: '0 20px 20px 0',
    backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
    ['&:after']: {
      content: 'attr(data-count)',
    }
  },
}));

function Bar(props: { count: number; table: string; max: number }) {
  const { count, table, max } = props;
  const value = Math.max(Math.floor((count / max) * 100), 1);
  const valueFloat = Math.floor((count / max) * 100);
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Typography variant="h4" noWrap align="right" sx={{ width: '250px' }}>{`${table}`}</Typography>
      <Box sx={{ ml: 1, flex: 1, position: 'relative' }}>
        <BorderLinearProgress variant="determinate" value={value} />
        <Typography variant="h4" sx={{ position: 'absolute', left: `calc(max(${valueFloat}%, 10%))`, top: 0, zIndex: 1, transition: 'left 1s', transform: 'translateX(-110%)' }} >{`${count}`}</Typography>
      </Box>
    </Box>
  );
}

interface IProps {
  readonly clickRecords: ReadonlyArray<{
    readonly click: number;
    readonly tableId: string;
    readonly name: string
  }>;
  readonly tables: ReadonlyArray<{ id: string; name: string; }>;
}

export default function Rank(props: IProps) {
  const { clickRecords, tables } = props;

  const [tableClicks, setTableClicks] = React.useState(
    new Map(tables.map(({ id, name }) => [id, { id, name, clicks: 0, rank: 0 }])));

  const maxTableClicks = useMemo(() => Math.max(
    ...clickRecords.reduce((result, record) => {
      const { tableId, click } = record;
      return result.set(tableId, (result.get(tableId) ?? 0) + click);
    }, new Map<string, number>()).values()
  ), [tables]);

  React.useEffect(() => {
    const totalPage = 20;
    const pageSize = Math.ceil(clickRecords.length / totalPage);
    let page = 0;
    const timer = setInterval(() => {
      page += 1;
      if (page > totalPage) {
        clearInterval(timer);
      }
      setTableClicks((prevTableClicks) => {
        const currentPageRecords = clickRecords.slice((page - 1) * pageSize, page * pageSize);
        const newTableClicks = currentPageRecords.reduce(
          (result, record) => {
            const { tableId, click } = record;
            const tableClick = result.get(tableId)!;
            result.set(tableId, { ...tableClick, clicks: tableClick.clicks + click })
            return result;
          },
          new Map(prevTableClicks)
        );
        Array.from(newTableClicks.values()).sort((a, b) => b.clicks - a.clicks).forEach((tableClick, i) => {
          newTableClicks.set(tableClick.id, { ...tableClick, rank: i });
        });
        return newTableClicks;
      });
    }, 400);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <Container maxWidth="lg" sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h2" gutterBottom sx={{ textAlign: 'center' }}>排行榜</Typography>
      <div style={{ height: '500px', position: 'relative', width: '100%', overflowY: 'hidden' }}>
        {Array.from(tableClicks.values()).map(({ id, name, clicks, rank }) => {
          return (
            <div key={id} style={{ position: 'absolute', top: rank * 50, width: '100%', transition: 'top 1s' }}>
              <Bar table={name} count={clicks} max={maxTableClicks} />
            </div>
          );
        })}
      </div>
    </Container>

  );
}
