import {
  Avatar,
  Box,
  Button,
  Stack,
  SvgIcon,
  SxProps,
  Typography,
  styled,
  useTheme,
} from '@mui/material'
import React from 'react'
import { TokenSelectionModal } from './TokenSelectionModal'
import { TokenConfig } from '../../types'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

const StyledTokenButton = styled(Button)(({ theme }) => {
  return {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    height: '32px',
    padding: '6px 8px',
    border: `1px solid ${theme.palette.other.border.secondary}`,
    borderRadius: '9999px',
    background: '#2F3C35',
    color: theme.palette.common.white,
    '&:hover': {
      background: '#2F3C35',
    },
  }
})

export interface TokenButtonProp {
  onAssetChange: (asset: TokenConfig) => void
  sx?: SxProps
}

export const TokenButton: React.FC<TokenButtonProp> = ({
  onAssetChange,
  sx,
}) => {
  const theme = useTheme()

  const [showModal, setShowModal] = React.useState<boolean>(false)
  const [asset, setAsset] = React.useState<TokenConfig>()

  const onClose = () => {
    console.log('onClose')
    setShowModal(false)
  }

  const handleAssetChange = (token: TokenConfig) => {
    setAsset(token)
    setShowModal(false)
    onAssetChange(token)
  }

  return (
    <Box>
      <StyledTokenButton
        sx={{ minWidth: '100px', ...sx }}
        onClick={() => {
          setShowModal(true)
        }}
      >
        <Stack
          direction={'row'}
          sx={{
            display: 'flex',
            width: '100%',
            alignItems: 'center',
          }}
        >
          {asset?.logoURI && (
            <Box
              sx={{
                width: '18px',
                height: '18px',
                mr: '8px',
              }}
            >
              <Avatar sx={{ width: '18px', height: '18px' }}>
                <img
                  src={asset.logoURI}
                  width={'18px'}
                  height={'18px'}
                  alt={asset.symbol}
                />
              </Avatar>
            </Box>
          )}
          <Box
            sx={{
              width: '100%',
              textAlign: 'left',
            }}
          >
            {asset ? asset.symbol : 'Select'}
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <ExpandMoreIcon />
          </Box>
        </Stack>
      </StyledTokenButton>
      <TokenSelectionModal
        openState={showModal}
        onClose={onClose}
        onAssetChange={handleAssetChange}
      />
    </Box>
  )
}
