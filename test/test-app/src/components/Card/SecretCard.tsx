import React, { useState } from 'react'
import { Box, useTheme, Stack, Typography, Tooltip, Avatar } from '@mui/material'
import { Copy } from '../Icon'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import { WarningAlert } from '../Alert/InfoAlert'
import { NoteWithToken } from '../../types'

export interface SecretCardProp {
  subject: string
  secret: string
  display: string
  compact?: boolean
  type?: 'dark' | 'light'
  onStore?: () => void
  warn?: boolean
  note?: NoteWithToken
}

export const SecretCard: React.FC<SecretCardProp> = ({
  subject,
  secret,
  display,
  compact = false,
  type = 'dark',
  onStore,
  warn = false,
  note,
}) => {
  const [expand, setExpand] = useState<boolean>(false)
  const theme = useTheme()

  const backgroundColor = () => {
    switch (type) {
      case 'dark':
        return '#576E63'
      case 'light':
        return theme.palette.action.disabledBackground
    }
  }

  const textColor = () => {
    switch (type) {
      case 'dark':
        return theme.palette.info.light
      case 'light':
        return theme.palette.secondary.main
    }
  }

  const extendColor = () => {
    switch (type) {
      case 'dark':
        return theme.palette.primary.main
      case 'light':
        return theme.palette.other.primary.p50
    }
  }

  const formatDisplay = () => {
    if (!expand && display) {
      return display + '***' + secret.slice(-4)
    } else {
      return secret
    }
  }

  return (
    <Box
      sx={{
        border: '1px solid #61C877',
        borderRadius: '8px',
        background: backgroundColor(),
      }}
    >
      <Stack direction={'column'}>
        <Box sx={{
          padding: '4px 12px',
          background: '#17181C',
          borderRadius: '8px 8px 0 0',
          alignItems: 'center'
        }}>
          <Typography
            variant="body-md"
            fontWeight={'bold'}
            sx={{
              alignSelf: 'stretch',
            }}
          >
            {subject}
          </Typography>
        </Box>
        <Stack direction={'column'} gap={'8px'} padding={'8px 12px 16px 12px'}>
          <Box
            sx={{
              color: textColor(),
              gap: theme.spacing(1),
            }}
          >
            {note && (
              <Box>
                <Stack direction={'row'} alignItems={'center'} spacing={theme.spacing(0.5)}>
                  {note.token.logoURI && (
                    <Avatar sx={{ width: '18px', height: '18px' }}>
                    <img src={note.token.logoURI} width={'18px'} height={'18px'} />
                  </Avatar>
                  )}
                  <Typography variant='button-md'>
                    {note.token.symbol}
                  </Typography>
                  <Typography variant='button-md'>
                    :
                  </Typography>
                  <Typography variant='button-md'>
                    {''}
                  </Typography>
                </Stack>
              </Box>
            )}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Typography
                noWrap={!expand}
                variant="body2"
                sx={{
                  width: '100%',
                  wordBreak: 'break-all',
                  alignSelf: 'stretch',
                }}
              >
                {formatDisplay()}
              </Typography>
              <Box
                sx={{
                  alignSelf: 'stretch',
                  display: 'flex',
                  cursor: 'pointer',
                }}
              >
                <Typography
                  variant="body-xs"
                  fontWeight={600}
                  color={extendColor()}
                  onClick={() => setExpand(!expand)}
                >
                  {!expand ? 'Expand' : 'Hide'}
                </Typography>
                {!expand ? (
                  <ExpandMoreIcon
                    sx={{
                      fontSize: '16px',
                      fill: extendColor(),
                    }}
                  />
                ) : (
                  <ExpandLessIcon
                    sx={{
                      fontSize: '16px',
                      fill: extendColor(),
                    }}
                  />
                )}
              </Box>
            </Box>
          </Box>
          <Stack direction={'row'} spacing={1}>
            <Copy
              note={secret}
              display={display}
              placement="top"
              type={type && type === 'light' ? 'secondary' : 'primary'}
              compact={compact}
            />
          </Stack>
        </Stack>
      </Stack>
    </Box>
  )
}
