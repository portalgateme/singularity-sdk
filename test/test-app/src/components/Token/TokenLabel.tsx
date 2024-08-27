import { Avatar, Box, FormControl, Stack, useTheme } from '@mui/material'
import React from 'react'


export const TokenLabel: React.FC<{ symbol: string, icon?: string, disabled?: boolean }> = ({ symbol, icon, disabled = false }) => {
    const theme = useTheme()
    return (
        <Box>
            <FormControl disabled={disabled}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    height: '32px',
                    padding: '6px 8px',
                    border: `1px solid ${theme.palette.other.border.secondary}`,
                    borderRadius: '9999px',
                    background: '#2F3C35',
                    color: theme.palette.common.white,
                    '&:hover': {
                        background: '#2F3C35',
                    },
                }}>
                    <Stack direction={'row'} sx={{
                        display: 'flex',
                        width: '100%',
                        alignItems: 'center',
                    }}>
                        <Box sx={{
                            width: '18px',
                            height: '18px',
                            mr: '8px',
                        }}>{icon && (
                            <Avatar sx={{ width: '18px', height: '18px' }}>
                                <img src={icon} width={'18px'} height={'18px'} />
                            </Avatar>
                        )}
                        </Box>
                        <Box sx={{
                            width: '100%',
                            textAlign: 'left',
                        }}>
                            {symbol}
                        </Box>
                    </Stack>
                </Box>
            </FormControl>
        </Box>
    )
}