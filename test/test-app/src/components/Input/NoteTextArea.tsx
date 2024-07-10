import {
  styled
} from '@mui/material'

export const NoteTextarea = styled('textarea')(({ theme }) => {
  return {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    boxShadow: '0px 4px 5px 0px rgba(33, 1, 38, 0.03) inset',
    background: '#2F3C35',
    border:'0px',
    height:'87px',
    color: theme.palette.info.light,
    wordBreak: 'break-all',
    resize: 'none',
    '&:focus': {
      outline: 'none',
    },
    ...theme.typography.body2,
  }
})