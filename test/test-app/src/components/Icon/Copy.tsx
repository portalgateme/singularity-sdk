import React, { useState } from 'react'
import { ContentCopy } from '@mui/icons-material'
import { Button, useTheme, Tooltip, Stack, Typography } from '@mui/material'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { ModalSmallButton } from '../Button/ModalButton'

export interface NoteProps {
  placement: 'top' | 'bottom' | 'left' | 'right'
  note: string
  display: string
  compact?: boolean
  type?: 'primary' | 'secondary'
}

export const Copy: React.FC<NoteProps> = ({
  placement,
  note,
  compact = false,
  type = 'primary',
}) => {
  const [title, setTitle] = useState('Click to copy')
  const theme = useTheme()

  const backgroundColor = () => {
    switch (type) {
      case 'primary':
        return undefined

      case 'secondary':
        return 'transparent'
    }
  }

  const textColor = () => {
    switch (type) {
      case 'primary':
        return theme.palette.secondary.main

      case 'secondary':
        return theme.palette.other.primary.p50
    }
  }
  return (
    <CopyToClipboard text={note}>
      <ModalSmallButton
        sx={{
          backgroundColor: backgroundColor(),
        }}
      >
        <Stack
          alignItems={'center'}
          justifyContent={'center'}
          direction={'row'}
          gap={theme.spacing(1)}
        >
          <ContentCopy
            sx={{
              width: '18px',
              height: '18px',
              color: textColor(),
            }}
          />
          {!compact && (
            <Typography variant="button-sm" fontWeight={600} color={textColor()}>
              Copy
            </Typography>
          )}
        </Stack>
      </ModalSmallButton>
    </CopyToClipboard>
  )
}
