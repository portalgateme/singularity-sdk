import { AppBar, Box, Stack, Toolbar, Typography, useTheme } from '@mui/material'
import React from 'react'
import { WalletConnectButton } from '../Button'


interface NavbarProps {
  title: string,
  drawerWidth: number,
}

const Navbar: React.FC<NavbarProps> = ({ title, drawerWidth }) => {
  const theme = useTheme()

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: '1049',
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
        background: '#0D0D0D', boxShadow: 'none',
        height: '131px',
        padding: '32px 8px'
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '0px' }} >
        <Box
          display="flex"
          color={theme.palette.common.white}
        >
          <Typography variant="h1" noWrap component="div">
            {title}
          </Typography>
        </Box>
        <Box>
          <Stack direction={'row'}>
            <WalletConnectButton />
          </Stack>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
