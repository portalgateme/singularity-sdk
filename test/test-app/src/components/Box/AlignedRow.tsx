import { Box, styled } from '@mui/material';

export const AlignedRow = styled(Box)(({ theme }) => {
    return {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: '1 0 0',
    }
})