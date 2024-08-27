import {
  Box,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  SvgIcon,
  Typography,
  useTheme,
} from '@mui/material'
import { isEmpty } from 'lodash'
import React, { useState } from 'react'
import { ModalButton, ModalCancelButton } from '../Button/ModalButton'
import { SecretCard } from '../Card'
import { NoteTextarea } from '../Input'
import { BasicModal } from './BasicModal'
import { InfoAlert } from '../Alert/InfoAlert'
import Image from 'next/image'
import { useToast } from '../../contexts/ToastContext/hooks'

export interface NoteSecretModalProp {
  openState: boolean
  secret: string
  display: string
  secretTitle: string
  onClose: () => void
  onProceed: () => void
  proceedActionTitle: string
  loading: boolean
  onStore: () => void
}

export const SecretModal: React.FC<NoteSecretModalProp> = ({
  openState,
  onClose,
  secret,
  display,
  secretTitle,
  onProceed,
  proceedActionTitle,
  loading,
  onStore,
}) => {
  const theme = useTheme()
  const [textareaValue, setTextareaValue] = useState('')
  const [secretConfirmed, setSecretConfirmed] = React.useState(false)

  const handleProceedClick = async () => {
    onProceed()
  }

  const handleConfirmSecretChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const secretInput = event.target.value.trim()
    setTextareaValue(secretInput)
    if (!isEmpty(secretInput) && secretInput === secret) {
      setSecretConfirmed(true)
    } else {
      setSecretConfirmed(false)
    }
  }

  const onStoreSuccess = () => {
    setTextareaValue(secret)
    setSecretConfirmed(true)
    onStore()
  }

  return (
    <BasicModal
      open={openState}
      onClose={onClose}
      scroll={'paper'}
      maxWidth={'md'}
      sx={{
        '& .MuiDialog-paper': {
          width: '659px',
        },
      }}
    >
      <DialogContent sx={{ padding: '0px' }}>
        <Stack direction={'column'} gap={theme.spacing(4)}>
          <Box>
            <Image src="/images/info.svg" width={42} height={42} alt="" />
            <Typography variant="h4">Confirm the Private Note</Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: theme.spacing(1),
            }}
          >
            <SecretCard
              subject={secretTitle}
              secret={secret}
              display={display}
              onStore={onStoreSuccess}
            />
            <InfoAlert
              text={'Please copy or download this Private Note to keep it safe'}
              type={''}
            />
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: theme.spacing(1),
            }}
          >
            <NoteTextarea
              rows={3}
              value={textareaValue}
              onChange={handleConfirmSecretChange}
              disabled={loading}
              placeholder="Paste your Private Note here..."
            />
            <InfoAlert
              text={'Please paste the Private Note you saved'}
              type={''}
            />
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ padding: '0px', mt: theme.spacing(4) }}>
        <ModalCancelButton onClick={onClose}>
          <Typography variant="button">Cancel</Typography>
        </ModalCancelButton>
        <ModalButton
          onClick={handleProceedClick}
          title={proceedActionTitle}
          loading={loading}
          disabled={loading || !secretConfirmed}
        />
      </DialogActions>
    </BasicModal>
  )
}
