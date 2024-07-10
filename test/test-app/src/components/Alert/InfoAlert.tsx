import { Alert, useTheme, SvgIcon, Typography, Stack } from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

export interface InfoAlertProp {
  type: string
  text: string
  children?: React.ReactNode
}

export const InfoAlert: React.FC<InfoAlertProp> = ({
  type,
  text,
  children,
}) => {
  const theme = useTheme()

  const selectType = () => {
    switch (type) {
      case 'info':
        return 'transparent'
      default:
        return theme.palette.primary.light
    }
  }
  return (
    <Alert
      sx={{
        width: 'fit-content',
        display: 'flex',
        alignItems: 'center',
        padding: '4px 12px',
        minHeight: '26px',
        borderRadius: '8px',
        background: selectType(),
        '& .MuiAlert-icon': {
          padding: 0,
          marginRight: theme.spacing(0.75),
        },
        '& .MuiAlert-message': {
          padding: 0,
        },
      }}
      icon={<InfoOutlinedIcon fontSize="small"/>}
    >
      <Stack direction={'row'} spacing={theme.spacing(1)}>
        <Typography variant="body-xs" fontWeight={600}>
          {text}
        </Typography>
        {children}
      </Stack>
    </Alert>
  )
}


export const WarningAlert: React.FC<{ text: string }> = ({
  text,
}) => {
  const theme = useTheme()

  return (
    <Alert
      severity="warning"
      sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        padding: '6px 6px',
        minHeight: '26px',
        border: '1px solid #F59E0B',
        borderRadius: '8px',
        background: '#FEFAE8',
        '& .MuiAlert-icon': {
          padding: 0,
          marginRight: theme.spacing(0.75),
          color: '#F59E0B',
        },
        '& .MuiAlert-message': {
          padding: 0,
        },
      }}
      icon={<InfoOutlinedIcon fontSize="small" sx={{color:'#F59E0B'}}/>}
    >
      <Stack direction={'row'} spacing={theme.spacing(1)}>
        <Typography variant="body-xs" color={'#17181C'} fontWeight={600}>
          {text}
        </Typography>
      </Stack>
    </Alert>
  )
}