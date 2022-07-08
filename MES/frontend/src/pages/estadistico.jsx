import React from 'react';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { Stack } from '@mui/material';
import { useState } from 'react';
import { setDate } from 'date-fns';
import { DatePicker } from '@mui/x-date-pickers';
export default function MaterialUIPickers() {
  const [value, setValue] = useState(new Date());
  const [Data, setData] = useState(new Date())
  const handleChange = (newValue) => {
    setValue(newValue);
  };
  console.log(value.getDay);
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Stack spacing={3}>
        <DatePicker
          label="Date mobile"
          inputFormat="MM/dd/yyyy"
          value={value}
          onChange={handleChange}
          renderInput={(params) => <TextField {...params}/>}
        />
        <h1>Seleccionado {value.getDate} </h1>
      </Stack>
    </LocalizationProvider>
  );
}