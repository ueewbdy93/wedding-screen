import React, { useEffect, useRef } from 'react';
import ClickBubble from './components/click-bubble';
import { TransitionGroup } from 'react-transition-group'



export interface IProps {
  readonly clickRecords: ReadonlyArray<{
    readonly clicks: number;
    readonly tableId: string;
    readonly name: string
  }>;
}

const ClickDashboard = React.memo(function (props: IProps) {
  const { clickRecords } = props;
  const renderedRecordIndexes = useRef(new Set<number>());

  const onEntered = React.useCallback((index: number) => {
    renderedRecordIndexes.current.add(index);
  }, []);

  return <TransitionGroup appear>
    {clickRecords.map((record, i) => {
      if (renderedRecordIndexes.current.has(i)) {
        return null;
      }
      return <ClickBubble key={i} id={i} name={record.name} tableName={record.tableId} clicks={record.clicks} onEntered={onEntered} />
    })}
  </TransitionGroup>;
});

export default React.memo((props: IProps) => {
  const [clickRecords, setClickRecords] = React.useState<IProps['clickRecords']>([]);
  const checkPointTs = useRef(Date.now());
  const checkPointIndex = useRef(0);
  useEffect(() => {
    if (Date.now() - checkPointTs.current > 500) {
      setClickRecords((prev) => prev.concat(props.clickRecords.slice(checkPointIndex.current, checkPointIndex.current + 10 - 1)));
      checkPointTs.current = Date.now();
      checkPointIndex.current = props.clickRecords.length - 1;
      return;
    } else {
      const timer = setTimeout(() => {
        setClickRecords((prev) => prev.concat(props.clickRecords.slice(checkPointIndex.current, checkPointIndex.current + 10 - 1)));
        checkPointIndex.current = props.clickRecords.length - 1;
        checkPointTs.current = Date.now();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [props.clickRecords.length])

  return <div style={{ height: '100vh', width: '100vw', overflow: 'hidden' }}><ClickDashboard clickRecords={clickRecords} /></div>;
})
