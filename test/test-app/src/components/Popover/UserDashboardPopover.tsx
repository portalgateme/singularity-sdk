import LogoutIcon from '@mui/icons-material/Logout';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Popover,
  useMediaQuery,
  useTheme
} from '@mui/material';
import React from 'react';
import styled from 'styled-components';
import { useAccount, useDisconnect } from 'wagmi';


const UserDashboardList = styled(List)<{ component?: React.ElementType }>({
  '& .MuiListItemButton-root': {
    paddingLeft: 24,
    paddingRight: 24,
  },
  '& .MuiListItemIcon-root': {
    minWidth: 0,
    marginRight: 16,
  },
  '& .MuiSvgIcon-root': {
    fontSize: 20,
  },
});


export const UserDashboardPopover: React.FC<{
  open: boolean
  anchorEl: HTMLElement | null
  onClose: () => void
  onReferral: () => void
}> = ({
  open,
  anchorEl,
  onClose,
  onReferral
}) => {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('lg'))
    const { disconnect } = useDisconnect()
    const { address } = useAccount()


    const logout = () => {
      disconnect()
      onClose()
    }

    return (
      <Popover
        id={'user-dashboard-popover'}
        open={open}
        anchorEl={anchorEl}
        onClose={onClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: isMobile ? 'center' : 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: isMobile ? 'center' : 'right',
        }}
        PaperProps={{
          sx: {
            marginTop: '10px',
            backgroundColor: theme.palette.secondary.main,
            borderRadius: '10px',
            border: '1px solid #3D4C44',
            padding: '10px 0px',
            height: '84px',
            width: '200px',
            overflowY: 'hidden',
          },
        }}
      >
        <Box>
          <UserDashboardList disablePadding>
            <ListItemButton
              onClick={logout}
              sx={{
                py: 0,
                minHeight: 32,
                color: theme.palette.common.white,
                '&:hover': {
                  backgroundColor: 'rgb(47, 60, 53)',
                }
              }}
            >
              <ListItemIcon sx={{ color: 'inherit' }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText
                primary={'Disconnect'}
                primaryTypographyProps={{ fontSize: 15, fontWeight: '500' }}
              />
            </ListItemButton>
          </UserDashboardList>
        </Box>
      </Popover>
    )
  }
