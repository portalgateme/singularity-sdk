import { Box, Button, useMediaQuery, useTheme } from '@mui/material'
import React, { useState } from 'react'
import { useAccount, useChainId, useConnect } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { formatWalletHash } from '../../helpers'
import { UserDashboardPopover } from '../Popover'


export const WalletConnectButton: React.FC = () => {
  const chainId = useChainId()
  const { address, isConnected } = useAccount()

  const theme = useTheme()
  const connected = address && chainId && isConnected
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)
  const [key, setKey] = useState<number>(Date.now())

  const { connect } = useConnect()

  const [openPopup, setOpenPopup] = useState(false)

  const handleOpenUserDashboard = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    setAnchorEl(event.currentTarget)
    setOpenPopup(true)
  }

  const onClickButtonConnect = () => {
    connect({
      chainId: chainId,
      connector: injected({ target: 'metaMask' }),
    })
  }

  const handlePopupClose = () => {
    setOpenPopup(false)
    setAnchorEl(null)
  }

  const onReferral = () => {
    setOpenPopup(false)
    setAnchorEl(null)
  }

  return (
    <Box key={key}>
      {connected ? (
        <Box>
          <Button
            variant="contained"
            onClick={handleOpenUserDashboard}
            sx={{
              height: '48px',
              padding: '10px 20px',
              lineHeight: '20px',
              fontSize: '14px',
              textTransform: 'none',
              borderRadius: '50px',
            }}
          >
            {formatWalletHash(address, 4)}
          </Button>
        </Box>
      ) : (
        <Button
          variant="contained"
          color="primary"
          onClick={onClickButtonConnect}
          sx={{
            height: '48px',
            padding: '10px 20px',
            lineHeight: '20px',
            fontSize: '14px',
            textTransform: 'none',
            borderRadius: '50px',
          }}
        >
          Connect Wallet
        </Button>
      )}
      <UserDashboardPopover
        open={openPopup}
        anchorEl={anchorEl}
        onClose={handlePopupClose}
        onReferral={onReferral}
      />
    </Box>
  )
}
