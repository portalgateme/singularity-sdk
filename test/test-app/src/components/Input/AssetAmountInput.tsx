import {
  Box,
  InputBase,
  Stack,
  useTheme
} from '@mui/material'
import React, { useState } from 'react'
import { TokenConfig } from '../../types'
import { TokenButton } from '../Token/TokenButton'


export interface AssetAmountInputProps {
  onAssetChange: (asset: TokenConfig) => void
  onAmountChange: (amount: string) => void
  type?: string
  title?: string
}

export const AssetAmountInput: React.FC<AssetAmountInputProps> = ({
  onAssetChange,
  onAmountChange,
  type,
  title,
}) => {
  const theme = useTheme()

  const [asset, setAsset] = useState<TokenConfig>()

  const handleAssetChange = (token: TokenConfig) => {
    if (token) {
      setAsset(token)
      onAssetChange(token)
    }
  }

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onAmountChange(event.target.value.trim())
  }

  const backgroundColor = () => {
    switch (type) {
      case 'dark':
        return theme.palette.secondary.main
      default:
        return '#F4F5F7'
    }
  }

  const textColor = () => {
    switch (type) {
      case 'dark':
        return 'white'
      default:
        return ''
    }
  }

  const border = () => {
    switch (type) {
      case 'dark':
        return `1px solid ${theme.palette.secondary.main}`
      default:
        return '1px solid #F7F7F8'
    }
  }

  return (
    <Box
      sx={{
        display: 'inline-flex',
        padding: '6px 12px',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '12px',
        border: border(),
        background: backgroundColor(),
        height: '60px',
        width: '100%',
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        sx={{
          width: '100%',
          height: '100%',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            minWidth: '150px',
          }}
        >
          <TokenButton
            onAssetChange={handleAssetChange}
            sx={{
              border: 'none',
            }}
          />
        </Box>
        <Box sx={{
          justifyContent: 'flex-end',
          width: '100%',
        }}>
          <InputBase
            type="number"
            onChange={handleAmountChange}
            fullWidth
            style={theme.typography.subtitle2}
            autoComplete="off"
            placeholder={title || 'Please enter your amount'}
            sx={{
              color: textColor(),
              textAlign: 'right',
              "& input": {
                textAlign: 'right',
              },
            }}
          />
        </Box>

      </Stack>
    </Box>
  )
}
