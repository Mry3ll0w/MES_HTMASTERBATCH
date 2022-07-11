import React, { Fragment } from 'react';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useState } from 'react';
import dateFormat from 'dateformat';
export default function BasicDatePicker() {
  const [value, setValue] = useState(null);

  return (
    <Fragment>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        label="Basic example"
        value={value}
        inputFormat="dd/mm/yyyy"
        onChange={(newValue) => {
          setValue(newValue);
        }}
        renderInput={(params) => <TextField {...params} />}
      />
    </LocalizationProvider>
    <h1>{dateFormat(value, "dd-mm-yyyy")}</h1>
    </Fragment>
    
  );
}
