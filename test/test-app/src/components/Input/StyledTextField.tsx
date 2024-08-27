import {
  InputBase,
  styled, TextField
} from '@mui/material'

export const StyledTextField = styled(InputBase)(({ theme }) => {
  return {
    height: '60px',
    background: '#F4F5F7',
    padding: '6px 12px',
    border: '1px solid rgba(61, 76, 68, 0.00)',
    borderRadius: '12px',
    color: theme.palette.secondary.main,
    ...theme.typography.body1,
  }
})