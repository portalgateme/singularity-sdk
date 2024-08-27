import LaunchIcon from '@mui/icons-material/Launch'
import {
  Box,
  Button,
  Link as MuiLink,
  ModalProps,
  Stack,
  Typography,
  useTheme,
  Checkbox,
} from '@mui/material'
import { isEmpty } from 'lodash'
import React from 'react'
import { formatWalletHash } from '../../helpers'
import { AlignedRow } from '../Box/AlignedRow'
import { BasicFormCardDark } from '../Card/BasicFormCard'
import { StyledDividerDark } from '../Divider/StyledDivider'
import { BasicModal } from './BasicModal'
import Link from 'next/link'
import Image from 'next/image'
import { networkConfig } from '../../constants/networkConfig'
import { config } from '../../constants'

export interface GeneralSuccessModalProp {
  actionTitle: string
  tx: string
  secretChildren?: React.ReactNode
  children?: React.ReactNode
  openState: boolean
  onClose: () => void
  confirm?: boolean
}

export const GeneralSuccessModal: React.FC<GeneralSuccessModalProp> = ({
  actionTitle,
  tx,
  secretChildren,
  children,
  openState,
  onClose,
  confirm = false,
}) => {
  const theme = useTheme()
  const chainId = config.chainId
  const [checked, setChecked] = React.useState(false)
  const confirmed = !confirm || checked

  const formatTx = () => {
    if (isEmpty(tx)) return ''
    return formatWalletHash(tx, 4)
  }

  const formatTxUrl = () => {
    if (isEmpty(tx)) return ''

    return `${networkConfig[chainId].explorerUrl.tx}${tx}`
  }

  const handleClose: ModalProps['onClose'] = (event, reason) => {
    if (reason && reason === 'backdropClick') return
    onClose()
  }

  return (
    <BasicModal
      open={openState}
      onClose={handleClose}
      scroll={'paper'}
      maxWidth={'md'}
      sx={{
        '& .MuiDialog-paper': {
          width: '659px',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          //   padding: theme.spacing(4),
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          flexShrink: 0,
          gap: theme.spacing(2),
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: theme.spacing(3),
          }}
        >
          <Box
            sx={{
              width: '83.5px',
              height: '83.5px',
              padding: '16.699px 16.699px 16.701px 16.701px',
              borderRadius: '9999px',
              background: '#16A34A',
            }}
          >
            <Image src="/images/success.svg" width={50} height={50} alt="" />
          </Box>
          <Typography
            variant="h2"
            color={theme.palette.common.white}
            mb={1}
            sx={{
              textAlign: 'center',
            }}
          >
            {actionTitle}
          </Typography>
        </Box>
        {secretChildren && (
          <Box width={'100%'}>
            {secretChildren}
          </Box>
        )}
        <BasicFormCardDark title={'Transaction Details'}>
          <Stack width={'100%'} direction={'column'} gap={theme.spacing(1)}>
            {children}
            <StyledDividerDark />
            <AlignedRow>
              <Typography variant="body-sm">Transaction ID:</Typography>
              <Stack direction={'row'}>
                <Typography
                  variant="body-sm"
                  fontWeight={600}
                  color={theme.palette.primary.main}
                >
                  {formatTx()}
                </Typography><MuiLink
                  href={formatTxUrl()}
                  underline={'none'}
                  rel={'noopener'}
                  target={'_blank'}
                >
                  <LaunchIcon sx={{ fontSize: '1rem', marginLeft: '5px' }} />
                </MuiLink>
              </Stack>
            </AlignedRow>
          </Stack>
        </BasicFormCardDark>
        {confirm && (
          <Box>
            <Stack direction={'row'} alignItems={'center'}>
              <Checkbox
                size={'small'}
                onChange={(e) => setChecked(e.target.checked)}
                sx={{
                  color: '#F59E0B',
                  '&.Mui-checked': {
                    color: theme.palette.primary.main,
                  },
                }}
              />
              <Typography variant="body-xs">All notes have been successfully downloaded or saved</Typography>
            </Stack>
          </Box>
        )}
        <Box
          display={'flex'}
          alignItems={'center'}
          flexDirection={'column'}
          gap={theme.spacing(2)}
        >
          <Link href={'/'}>
            <Button variant="contained" disabled={!confirmed} disableRipple>
              Back to dashboard
            </Button>
          </Link>
        </Box>
        <Typography variant="body-xs" textAlign="center">
          Note that transaction information displayed above will disappear after
          refreshing the page
        </Typography>
      </Box>
    </BasicModal>
  )
}
