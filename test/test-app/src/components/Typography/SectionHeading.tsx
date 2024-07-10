import {
    styled,Typography
  } from '@mui/material'
  

export const SectionHeading = styled(Typography)(({ theme }) => {
    return {
      color: theme.palette.secondary.main,
      fontSize: theme.typography.subtitle2.fontSize,
      fontWeight: theme.typography.subtitle2.fontWeight,
      lineHeight: theme.typography.subtitle2.lineHeight,
      padding:'12px 0',
    }
  })