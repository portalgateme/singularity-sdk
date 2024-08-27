import { Box, Typography, useTheme } from '@mui/material'
import React from 'react'
import { StyledInfoBox } from '../Box/StyledInfoBox'

export interface BasicFormCardProp {
  title?: string
  children?: React.ReactNode
}

export const BasicFormCardDark: React.FC<BasicFormCardProp> = ({
  title,
  children,
}) => {
  const theme = useTheme()

  return (
    <Box
      sx={{
        padding: '16px 12px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        borderRadius: '8px',
        background: '#2F3C35',
        width: '100%',
      }}
    >
      {title && (
        <Typography variant="h4" color={theme.palette.info.light} mb={2}>
          {title}
        </Typography>
      )}
      {children}
    </Box>
  )
}

export const BasicFormCardLight: React.FC<BasicFormCardProp> = ({
  title,
  children,
}) => {
  const theme = useTheme()

  return (
    <StyledInfoBox>
      <Typography variant="h4" color={theme.palette.secondary.main}>
        {title}
      </Typography>
      {children}
    </StyledInfoBox>
  )
}
