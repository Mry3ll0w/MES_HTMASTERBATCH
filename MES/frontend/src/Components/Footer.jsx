import React from 'react'
import { styles } from '../Style/styles'
import Typography from '@mui/material/Typography';
export default function Footer() {
  return (
    <div style={styles.home_footer}>
      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
      ©HTM-UNNOX-GROUP 2022
      </Typography>
    </div>
  )
}
