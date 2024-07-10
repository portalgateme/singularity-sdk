import React from 'react'
import { Stack, Typography, useTheme } from '@mui/material'
import { networkConfig } from '../../constants/networkConfig'
import { config } from '../../constants'

interface CustomToastProps {
  hash?: string
  message: string
  hint?: string
}

const CustomToast: React.FC<CustomToastProps> = ({ hash, message, hint }) => {
  const theme = useTheme()
  const chainId = config.chainId

  return (
    <Stack spacing={0.5} justifyContent="center" alignItems="start" ml={1}>
      <Typography variant="body2" color="black">
        {message}
      </Typography>
      {hint && (
        <Typography variant="caption" color="grey">
          {hint}
        </Typography>
      )}
      {hash && (
        <a
          target="_blank"
          href={`${networkConfig[chainId].explorerUrl.tx}${hash}`}
          rel="noreferrer"
        >
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.primary.main,
            }}
          >
            Inspect on Etherscan
          </Typography>
        </a>
      )}
    </Stack>
  )
}

export default CustomToast
