import {
  Box,
  Card,
  FormControl,
  styled,
  TextField,
  Typography,
  useTheme,
} from '@mui/material'
import BN from 'bignumber.js'
import { isEmpty } from 'lodash'
import React, { useState } from 'react'
import { useAccount } from 'wagmi'
import { config } from '../../constants'
import { tokenConfig } from '../../constants/tokenConfig'
import { useToast } from '../../contexts/ToastContext/hooks'
import { useTakerDeposit } from '../../hooks/useTakerDeposit'
import { TokenConfig } from '../../types'
import { LoadingExtButton } from '../Button/LoadingButton'
import { NoteTextarea } from '../Input'
import { AssetAmountInput } from '../Input/AssetAmountInput'
import { GeneralSuccessModal } from '../Modal/GeneralSuccessModal'
import { SectionHeading } from '../Typography/SectionHeading'
import { useTakerWithdraw } from '../../hooks/useTakerWithdraw'

export const StyledCard = styled(Card)(() => {
  return {
    boxShadow: 'none',
    width: '648px',
    minHeight: '265px',
  }
})

export const DemoSwapTakerWithdrawCard: React.FC = () => {
  const theme = useTheme()
  const [loading, setLoading] = useState(false)
  const { closeToast } =
    useToast()
  const [error, setError] = useState<string | null>(null)
  const {
    address,
    connector: activeConnector,
    isConnected,
  } = useAccount()
  const chainId = config.chainId
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false)
  const [key, setKey] = useState<number>(Date.now())

  const [makerAsset, setMakerAsset] = useState<TokenConfig>(tokenConfig[chainId][0])
  const [makerAmount, setMakerAmount] = useState<number>()
  const [takerAsset, setTakerAsset] = useState<TokenConfig>(tokenConfig[chainId][0])
  const [takerAmount, setTakerAmount] = useState<number>()

  const [ethTx, setEthTx] = useState<string>('')

  const { execute } = useTakerWithdraw()
  const [fullSwapSecret, setFullSwapSecret] = useState<string>('')
  const [orderId, setOrderId] = useState<string>('')


  const handleFullSwapSecretChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFullSwapSecret(event.target.value.trim())
  }

  const onReset = () => {
    console.log('onreset')
    setShowSuccessModal(false)
    setKey(Date.now())
  }

  const doTakerWithdraw = async () => {
    if (!fullSwapSecret) {
      setError('Please enter the full swap secret')
      return
    }

    if (!isConnected || !activeConnector || !address || !chainId) {
      setError('No wallet connected!')
      return
    }

    setError(null)
    setLoading(true)

    try {
      await execute(fullSwapSecret)
      setShowSuccessModal(true)
    } catch (error: any) {
      setError(error.message)
      console.error(
        'Deposit error on preparation: ',
        error.message,
        error.stack,
      )
    } finally {
      setLoading(false)
      closeToast()
    }
  }



  return (
    <StyledCard key={key}>
      <FormControl disabled={loading || !isConnected} fullWidth>
        <Box>
          <Box
            component={'div'}
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              minHeight: '265px',
              gap: theme.spacing(1),
            }}
          >
            <SectionHeading>Full Swap Secret</SectionHeading>
            <NoteTextarea
              value={fullSwapSecret}
              onChange={handleFullSwapSecretChange}
            />
          </Box>

          <LoadingExtButton
            disabled={loading || !fullSwapSecret || !isEmpty(error)}
            loading={loading}
            title={'Withdraw'}
            onClick={doTakerWithdraw}
          />
        </Box>
      </FormControl>

      {error && (
        <Typography
          variant="body1"
          mt={2}
          sx={{ color: theme.palette.error.main }}
        >
          <strong>Notice:</strong>&nbsp;
          <span style={{ wordBreak: 'break-word' }}>{error}</span>
        </Typography>
      )}

      <GeneralSuccessModal
        actionTitle="Your withdraw is complete"
        tx={ethTx}
        openState={showSuccessModal}
        onClose={onReset}
      >
      </GeneralSuccessModal>
    </StyledCard>
  )
}
