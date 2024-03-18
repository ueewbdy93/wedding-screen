import React, { useState, useCallback, useEffect } from 'react';

export interface IProps {
  readonly onClick: (args: { clicks: number }) => void;
}

export default React.memo(function ComponentName(props: IProps) {
  const { } = props;
  const [clicks, setClicks] = useState(0);

  useEffect(() => {
    const int = setInterval(() => {
      setClicks((prev) => {
        if (prev > 0) {
          props.onClick({ clicks })
        }
        return 0
      });
    }, 200);

    return () => {
      clearInterval(int)
    };
  }, [])


  useEffect(() => {
    if (disabled) {
      setClicks((prev) => {
        if (prev > 0) {
          props.onClick({ clicks })
        }
        return 0
      });
    }
  }, [disabled])

  return <button onClick={onClick} />;
});
