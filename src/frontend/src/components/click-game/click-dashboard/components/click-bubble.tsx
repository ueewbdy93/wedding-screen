import React from 'react';
import { Transition } from 'react-transition-group';
import { useRef, useMemo } from 'react';
import { getContrastRatio } from '@mui/material/styles';
import * as allColors from '@mui/material/colors';

const colors = [
  allColors.red[400],
  allColors.pink[300],
  allColors.purple[300],
  allColors.deepPurple[400],
  allColors.indigo[400],
  allColors.blue[600],
  allColors.lightBlue[600],
  allColors.cyan[700],
  allColors.teal[400],
  allColors.green[600],
  allColors.lightGreen[800],
  allColors.lime[900],
  allColors.yellow[200],
  allColors.amber[200],
  allColors.orange[200],
  allColors.deepOrange[200],
  allColors.brown[300],
  allColors.grey[300],
  allColors.blueGrey[400],
]
/**
 * @returns a random number between 0 and 1
 */
function gaussianRand() {
  let rand = 0;
  for (var i = 0; i < 6; i += 1) {
    rand += Math.random();
  }
  return rand / 6;
}

function hash(str: string) {
  let arr = str.split('');
  return Math.abs(arr.reduce(
    (hashCode, currentVal) =>
      (hashCode = currentVal.charCodeAt(0) + (hashCode << 6) + (hashCode << 16) - hashCode),
    0
  ));
};

export interface IProps {
  readonly id: number;
  readonly appear?: boolean;
  readonly in?: boolean;
  readonly onEntered: (id: number) => void;
  readonly name: string;
  readonly tableName: string;
  readonly clicks: number;
}


const transitionStyles = {
  entering: { transform: 'translateY(0)', opacity: 1 },
  entered: { transform: 'translateY(0)', opacity: 0 },
  exiting: { transform: 'translateY(-100%)', opacity: 0 },
  exited: { transform: 'translateY(100%)', opacity: 0 },
  unmounted: undefined,
} as const;

export default React.memo(function ComponentName(props: IProps) {
  const { id, in: inProps, name, tableName, clicks } = props;
  const nodeRef = useRef(null);
  const onEntered = React.useCallback(() => {
    props.onEntered(id);
  }, [id, props.onEntered]);

  const positionStyle = useMemo(() => {
    return {
      position: 'absolute',
      top: `calc(1vh * ${gaussianRand() * 100})`,
      left: `calc(1vw * ${gaussianRand() * 100})`,
      transform: 'translateX(-50%) translateY(-50%)',
    } as const
  }, []);

  const style = useMemo(() => {
    const backgroundColor = colors[hash(tableName) % colors.length];
    const delayMs = Math.random() * 500;
    return {
      zIndex: id,
      fontSize: '30px',
      padding: '0.25em 1em',
      borderRadius: '10rem',
      backgroundColor,
      color: getContrastRatio('#fff', backgroundColor) > 3 ? '#fff' : '#000',
      fontWeight: '500',
      transition: `transform 500ms ease-in-out ${delayMs}ms, opacity 500ms ease-in-out ${delayMs}ms`,
    } as const
  }, [tableName, id]);

  return <Transition nodeRef={nodeRef} unmountOnExit appear={true} in={inProps} onEntered={onEntered} timeout={{ enter: 1000 }}>
    {(state) => {
      return <div ref={nodeRef} style={positionStyle}>
        <div style={{ ...style, ...transitionStyles[state] }}>
          <small>{tableName}</small><br />{name}＋{clicks}
        </div>
      </div>;
    }}
  </Transition>;
});
