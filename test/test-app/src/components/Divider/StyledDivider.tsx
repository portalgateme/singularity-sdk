import {
    Divider,
    styled
} from '@mui/material'

export const StyledDivider = styled(Divider)(({ theme }) => {
    return {
        background: '#D1DFD9',
        height: '1px',
        width: '100%',
    }
})

export const StyledDividerDark = styled(Divider)(({ theme }) => {
    return {
        background: '#576E63',
        height: '1px',
        width: '100%',
    }
})