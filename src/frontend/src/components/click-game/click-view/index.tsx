import { Typography } from '@mui/material';
import ButtonBase from '@mui/material/ButtonBase';
import React, { useCallback, useState, useEffect } from 'react';
import { keyframes } from 'tss-react';
import Ready from './components/ready';
import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()({
  animCircle: {
    color: 'transparent',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100px',
    height: '100px',
    borderRadius: '100%',
    background: 'rgba(188, 237, 243, 0.889)',
    boxShadow: `0 0 0 15px rgba(188, 237, 243, 0.3), 0 0 0 30px rgba(188, 237, 243, 0.3), 0 0 0 45px rgba(188, 237, 243, 0.3), 0 0 0 60px rgba(188, 237, 243, 0.3), 0 0 0 75px rgba(188, 237, 243, 0.3)`,
  },
  breath: {
    animation: `${keyframes`
    0% {
      box-shadow: 0 0 0 15px rgba(188, 237, 243, 0.3), 0 0 0 30px rgba(188, 237, 243, 0.3), 0 0 0 45px rgba(188, 237, 243, 0.3), 0 0 0 60px rgba(188, 237, 243, 0.3), 0 0 0 75px rgba(188, 237, 243, 0.3);
    }
    50% {
        box-shadow: 0 0 0 25px rgba(188, 237, 243, 0.3), 0 0 0 60px rgba(188, 237, 243, 0.3), 0 0 0 75px rgba(188, 237, 243, 0.3), 0 0 0 100px rgba(188, 237, 243, 0.3), 0 0 0 125px rgba(188, 237, 243, 0.3);
    }
    100% {
        box-shadow: 0 0 0 15px rgba(188, 237, 243, 0.3), 0 0 0 30px rgba(188, 237, 243, 0.3), 0 0 0 45px rgba(188, 237, 243, 0.3), 0 0 0 60px rgba(188, 237, 243, 0.3), 0 0 0 75px rgba(188, 237, 243, 0.3);
    } 
    `} 3s linear infinite`
  }
});

interface IProps {
  readonly onClick: (args: { clicks: number }) => void;
}

export default function ClickView(props: IProps) {
  const { classes, cx } = useStyles();
  const [isReady, setIsReady] = React.useState(false);
  const onReady = useCallback(() => {
    setIsReady(true)
  }, [])

  const [, setClicks] = useState(0);
  const handleClick = useCallback((e: any) => {
    e.preventDefault();
    setClicks((prev) => prev + 1);
  }, []);

  useEffect(() => {
    const int = setInterval(() => {
      setClicks((prev) => {
        if (prev > 0) {
          props.onClick({ clicks: prev })
        }
        return 0
      });
    }, 500);

    return () => {
      clearInterval(int)
    };
  }, [])

  return (
    <ButtonBase sx={{ width: '100vw', height: '100vh', background: 'rgba(188, 237, 243, 0.3)' }}
      disabled={!isReady}
      onClick={handleClick}
    >
      <div className={cx({ [classes.animCircle]: true, [classes.breath]: isReady })} />
      {!isReady ? <Ready onReady={onReady} /> : <Typography
        variant="h2"
        sx={{
          fontWeight: 700,
          position: 'relative',
          color: 'white',
        }}
      >
        點我!
      </Typography>}
    </ButtonBase>
  );
}
