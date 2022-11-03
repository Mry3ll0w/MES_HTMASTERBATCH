import React from "react";
import { styles } from "../Style/styles";
import Typography from "@mui/material/Typography";
export default function Footer() {
  return (
    <div style={styles.home_footer} className='footer fixed-bottom mt-4 py-3'>
      <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
        ©UNNOX-GROUP-HT 2022
      </Typography>
    </div>
  );
}
