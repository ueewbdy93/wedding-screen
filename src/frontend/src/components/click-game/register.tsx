import { Button, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import MenuItem from '@mui/material/MenuItem';
import React, { useCallback } from 'react';


interface IProps {
  readonly loading: boolean;
  readonly tables: ReadonlyArray<{ id: string; name: string; }>;
  readonly onSubmit: (args: { readonly name: string, readonly tableId: string }) => void
}
export default function Register(props: IProps) {
  const { loading, tables } = props;

  const [name, setName] = React.useState('');
  const [tableId, setTableId] = React.useState('');


  const onSubmit = useCallback<React.FormEventHandler<HTMLFormElement>>((e) => {
    e.preventDefault();
    props.onSubmit({ name, tableId })
  }, [props.onSubmit, name, tableId])

  const disabled = loading || name === '' || tableId === '';

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="90vh">
      <Box sx={{ mx: 'auto', width: 300 }} component="form" onSubmit={onSubmit}>
        <TextField
          fullWidth
          label="請輸入您的姓名"
          margin="normal"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <TextField
          margin="normal"
          fullWidth
          select
          label="所屬桌號"
          value={tableId}
          onChange={(event) => setTableId(event.target.value)}
        >
          {tables.map(({ name, id }) => (
            <MenuItem key={id} value={id}>
              {name}
            </MenuItem>
          ))}
        </TextField>
        <Box sx={{ m: 2 }}>
          <Button type="submit" variant="contained" disabled={disabled}>
            儲存
          </Button>
        </Box>
        {loading ? <LinearProgress /> : <span>請輸入您的姓名與桌號以報名遊戲</span>}
      </Box>
    </Box>
  );
}
