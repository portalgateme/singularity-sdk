import { Box } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Navbar from '../Navigation/Navbar'

interface Props {
  children?: React.ReactNode,
  title: string,
}


const Layout: React.FC<Props> = ({ children, title }) => {

  const [mounted, setMounted] = useState(false)
  const drawerWidth = 313

  useEffect(() => {
    setMounted(true)
  }, [])


  if (!mounted) return null


  return (
    <Box sx={{ display: 'flex' }} >
      <Navbar title={title} drawerWidth={drawerWidth} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          height: '100vh',
          overflow: 'auto',
          position: 'relative',
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}>
        <Box sx={{ height: '130px' }}></Box>
        <Box sx={{
          justifyContent: 'center',
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {children}
        </Box>
      </Box>
    </Box>
  )
}

export default Layout
