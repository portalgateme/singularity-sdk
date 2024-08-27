import CloseIcon from '@mui/icons-material/Close'
import TokenIcon from '@mui/icons-material/Token'
import {
    Avatar,
    Box,
    Button,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    Stack,
    Typography,
    useTheme
} from '@mui/material'
import React, { useEffect } from 'react'
import { config } from '../../constants'
import { tokenConfig } from '../../constants/tokenConfig'
import { formatWalletHash } from '../../helpers'
import { TokenConfig } from '../../types'
import { BasicModal } from '../Modal/BasicModal'

export interface TokenSelectionModalProp {
    openState: boolean,
    onClose: () => void,
    onAssetChange: (token: TokenConfig) => void,
}

export const TokenSelectionModal: React.FC<TokenSelectionModalProp> = ({ openState, onClose, onAssetChange }) => {

    const theme = useTheme()
    const chainId = config.chainId

    const [searchResult, setSearchResult] = React.useState<TokenConfig[]>()

    const getPopularTokens = (tokens: TokenConfig[] | undefined) => {
        if (!tokens)
            return []
        return tokens.filter(token => token.popular)
    }

    const getTopTokens = (tokens: TokenConfig[] | undefined) => {
        if (!tokens)
            return []
        return tokens.filter(token => token.isTop)
    }

    useEffect(() => {
        if (openState) {
            setSearchResult(getPopularTokens(tokenConfig[chainId]))
        }
    }, [openState]);

    return (
        <BasicModal
            open={openState}
            onClose={onClose}
            scroll={'paper'}
            maxWidth={'md'}
        >
            <DialogTitle id="tokenSelectionDialogTitle" sx={{ padding: '0px', mb: '16px', height: '23px' }}>
                <Stack width={'100%'} direction={'row'}
                    sx={{ alignItems: 'center', justifyContent: 'space-between' }}
                >
                    <Typography variant='h4' color={theme.palette.common.white} width={"100%"}>
                        Select a token
                    </Typography>
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        sx={{
                            color: (theme) => theme.palette.grey[500],
                            width: '24px',
                            height: '24px',
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </Stack>
            </DialogTitle>
            <DialogContent sx={{ width: '462px', padding: '0px' }}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        gap: '16px',
                        flexShrink: '0',
                    }}
                >
                    <Box sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '6px',
                    }}>
                        {getTopTokens(tokenConfig[chainId]).map((token) => (
                            <Button key={token.symbol}
                                onClick={() => { onAssetChange(token) }}
                                component="label"
                                variant="contained"
                                startIcon={token.logoURI ?
                                    <Avatar sx={{ background: 'transparent', width: '24px', height: '24px' }}>
                                        <img src={token.logoURI} width={'24px'} height={'24px'} />
                                    </Avatar>
                                    : <Avatar sx={{ background: 'transparent', width: '24px', height: '24px' }}>
                                    </Avatar>}
                                sx={{
                                    height: '48px',
                                    padding: '12px 20px',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: '9999px',
                                    border: '1px solid #576E63',
                                    background: '#17181C',
                                    color: theme.palette.common.white,
                                    '&:hover': {
                                        backgroundColor: '#2C2D31',
                                    },
                                }}>
                                <Typography></Typography>
                                {token.symbol}
                            </Button>
                        ))}

                    </Box>
                    <Divider sx={{ width: '100%', background: '#BBD0C5' }} />
                    <Box>
                        <Typography variant='h4' color={theme.palette.common.white} width={"100%"}>
                            Popular tokens
                        </Typography>
                    </Box>
                    <Box width={'100%'}>
                        <List disablePadding>
                            {searchResult?.map((token) => (
                                <ListItem key={token.name} disablePadding>
                                    <ListItemButton
                                        onClick={() => { onAssetChange(token) }}
                                        sx={{
                                            padding: '8px 0px',
                                            height: '56px',
                                            '&:hover': {
                                                backgroundColor: '#2C2D31',
                                            },
                                        }}>
                                        <ListItemAvatar>
                                            {token.logoURI ? (
                                                <Avatar sx={{ background: '#2C2D31', width: '36px', height: '36px' }}>
                                                    <img src={token.logoURI} width={'36px'} height={'36px'} />
                                                </Avatar>
                                            ) : (
                                                <Avatar sx={{ background: '#17181C', width: '36px', height: '36px' }}>
                                                    <TokenIcon sx={{ color: '#2C2D31', width: '36px', height: '36px' }} />
                                                </Avatar>
                                            )}
                                        </ListItemAvatar>
                                        <ListItemText primary={token.name}
                                            secondary={
                                                <Stack direction={'row'} gap={theme.spacing(1)}>
                                                    <Typography variant="body2" sx={{ color: '#E8EFEC' }}>
                                                        {token.symbol}
                                                    </Typography>
                                                    <Typography variant="body2" sx={{ color: theme.palette.grey[500] }}>
                                                        {formatWalletHash(token.address, 4)}
                                                    </Typography>
                                                </Stack>
                                            }
                                        />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>

                    </Box>
                </Box>
            </DialogContent>
            <DialogActions></DialogActions>
        </BasicModal>
    )
}