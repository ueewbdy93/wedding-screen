import React from 'react';
import { TransitionGroup, Transition } from 'react-transition-group';
import { makeStyles } from 'tss-react/mui';
import { Typography } from '@mui/material';

const OVERLAY_DURATION_MS = 300;
const READY_TEXT_DURATION_MS = 800;
const GO_TEXT_DURATION_MS = READY_TEXT_DURATION_MS;
const useStyles = makeStyles()({
  overlay: {
    position: 'absolute',
    background: 'black',
    opacity: 0.7,
    height: '100px',
    left: '100%',
    top: 0,
    right: 0,
    transition: `left ${OVERLAY_DURATION_MS}ms ease-in-out,right ${OVERLAY_DURATION_MS}ms ease-in-out`,
    zIndex: 1000,
    // clipPath: `polygon(100% 0%, 90% 10%, 100% 20%, 90% 30%, 100% 40%, 90% 50%, 100% 60%, 90% 70%, 100% 80%, 90% 90%, 100% 100%, 0% 100%, 10% 90%, 0% 80%, 10% 70%, 0% 60%, 10% 50%, 0% 40%, 10% 30%, 0% 20%, 10% 10%, 0% 0%)`,
  },

  readyText: {
    position: 'absolute',
    left: 0,
    top: '100%',
    width: '100%',
    height: '100%',
    lineHeight: '100px',
    color: 'white',
    // fontSize: '72px',
    fontWeight: 700,
    opacity: 0,
    transition: `top ${READY_TEXT_DURATION_MS}ms ease-in-out, opacity ${READY_TEXT_DURATION_MS}ms ease-in-out`,
    zIndex: 1001,
  },

  goText: {
    position: 'absolute',
    left: 0,
    top: '100%',
    width: '100%',
    height: '100%',
    lineHeight: '100px',
    color: 'white',
    // fontSize: '72px',
    fontWeight: 700,
    opacity: 0,
    transition: `top ${GO_TEXT_DURATION_MS}ms ease-in-out, opacity ${GO_TEXT_DURATION_MS}ms ease-in-out`,
    zIndex: 1001,
  },
});

const overlayStyles = {
  entering: { left: 0 },
  entered: { left: 0 },
  exiting: { left: 0, right: '100%' },
  exited: { left: '100%', right: 0 },
  unmounted: undefined,
} as const;

const readyTextStyles = {
  entering: { top: 0, opacity: 1 },
  entered: { top: 0, opacity: 1 },
  exiting: { top: '-100%', opacity: 0 },
  exited: { top: '100%', opacity: 0 },
  unmounted: undefined,
} as const;


interface IProps {
  readonly onReady: () => void;
}

export default React.memo(function Start(props: IProps) {
  const { classes } = useStyles();
  const [step, setStep] = React.useState(1);
  const overlayRef = React.useRef(null);
  const readyTextRef = React.useRef(null);
  const goTextRef = React.useRef(null);
  const nextStep = React.useCallback(() => {
    setStep((prev) => (prev + 1));
  }, []);

  return <div style={{ position: 'absolute', top: 'calc(50vh - 50px)', left: 0, right: 0, zIndex: 999, height: '100px' }}>
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <TransitionGroup appear >
        {step > 0 && step < 5 ? (
          <Transition nodeRef={overlayRef} timeout={OVERLAY_DURATION_MS} unmountOnExit onEntered={nextStep} onExited={props.onReady}>
            {(state) => {
              return <div ref={overlayRef} className={classes.overlay} style={overlayStyles[state]}></div>;
            }}
          </Transition>
        ) : null}
        {step > 1 && step < 3 ? (
          <Transition
            nodeRef={readyTextRef}
            timeout={1000 + READY_TEXT_DURATION_MS}
            unmountOnExit
            mountOnEnter
            onEntered={nextStep}
          >
            {(state) => {
              return (
                <Typography ref={readyTextRef} variant="h2" className={classes.readyText} style={readyTextStyles[state]}>
                  預備備…
                </Typography>
              );
            }}
          </Transition>
        ) : null}
        {step > 2 && step < 4 ? (
          <Transition
            nodeRef={goTextRef}
            timeout={500 + GO_TEXT_DURATION_MS}
            unmountOnExit
            mountOnEnter
            onEntered={nextStep}
            onExiting={nextStep}
          >
            {(state) => {
              return (
                <Typography ref={goTextRef} variant="h2" className={classes.goText} style={readyTextStyles[state]}>
                  開始!
                </Typography>
              );
            }}
          </Transition>
        ) : null}
      </TransitionGroup>
    </div>
  </div>;
});
