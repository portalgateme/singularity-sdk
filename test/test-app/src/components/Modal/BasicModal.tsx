import { Backdrop, Dialog, DialogProps, styled } from '@mui/material'

const StyledBackdrop = styled(Backdrop)({
    background: 'rgba(23, 24, 28, 0.95)',
})

const StyledModal = styled(Dialog)(({ theme }) => {
    return {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '& .MuiDialog-paper': {
            padding: '32px',
            background: '#17181C',
            borderRadius: '8px',
            border: '1px solid #3D4C44',
            color: theme.palette.common.white,
            margin: '0 auto',
        },
    }
})

export const BasicModal: React.FC<DialogProps> = (props: DialogProps) => {
    return (
        <StyledModal
            slots={{
                backdrop:
                    StyledBackdrop
            }}
            {...props}>

        </StyledModal>
    )
}