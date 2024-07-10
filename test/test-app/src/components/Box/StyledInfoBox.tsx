import {
    Box,
    styled
} from '@mui/material'
  
  export const StyledInfoBox = styled(Box)(({ theme }) => {
    return {
        padding: '16px 12px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        borderRadius: '8px',
        background: '#E8EFEC',
        width:'100%',
    }
  })