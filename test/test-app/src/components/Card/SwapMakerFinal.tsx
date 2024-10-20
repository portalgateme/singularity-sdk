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
import { useMakerSwap } from '../../hooks/useMakerSwap'

export const StyledCard = styled(Card)(() => {
  return {
    boxShadow: 'none',
    width: '648px',
    minHeight: '265px',
  }
})

export const DemoSwapMakerFinalCard: React.FC = () => {
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

  const { execute } = useMakerSwap()
  const [orderId, setOrderId] = useState<string>('')

  const [fullSwapSecret, setFullSwapSecret] = useState<string>('')

  const handleOrderIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOrderId(event.target.value.trim())
  }

  const handleMakerAssetChange = (value: TokenConfig) => {
    setError(null)
    setMakerAsset(value)
  }

  const handleMakerAmountChange = (value: string) => {
    setError(null)
    if (!isNaN(Number(value))) {
      const amount = parseFloat(value)
      if (amount <= 0) {
        setError('Amount must be greater than 0')
        return
      }
      setMakerAmount(parseFloat(value))
    } else {
      setMakerAmount(undefined)
    }
  }

  const handleTakerAssetChange = (value: TokenConfig) => {
    setError(null)
    setTakerAsset(value)
  }

  const handleTakerAmountChange = (value: string) => {
    setError(null)
    if (!isNaN(Number(value))) {
      setTakerAmount(parseFloat(value))
    } else {
      setTakerAmount(undefined)
    }
  }

  const handleFullSwapSecretChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFullSwapSecret(event.target.value.trim())
  }

  const onReset = () => {
    console.log('onreset')
    setShowSuccessModal(false)
    setKey(Date.now())
  }

  const doTakerDeposit = async () => {
    if (!makerAmount || !makerAsset || !takerAmount || !takerAsset || !orderId) {
      setError('Please enter the amount and select a token')
      return
    }

    if (!isConnected || !activeConnector || !address || !chainId) {
      setError('No wallet connected!')
      return
    }

    const makerAmountBN = BigInt(
      new BN(makerAmount).multipliedBy(new BN(10).pow(makerAsset.decimals)).toFixed(0, 1),
    )
    const takerAmountBN = BigInt(
      new BN(takerAmount).multipliedBy(new BN(10).pow(takerAsset.decimals)).toFixed(0, 1),
    )

    setError(null)
    setLoading(true)

    try {
      await execute(
        makerAsset,
        makerAmountBN,
        takerAsset,
        takerAmountBN,
        orderId,
        fullSwapSecret
      )
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
            <SectionHeading>Order Settings</SectionHeading>
            <TextField
              label="Order ID"
              value={orderId}
              onChange={handleOrderIdChange}
              fullWidth
            />
            <AssetAmountInput
              onAssetChange={handleMakerAssetChange}
              onAmountChange={handleMakerAmountChange}
              title="Maker Asset & Amount"
            />
            <AssetAmountInput
              onAssetChange={handleTakerAssetChange}
              onAmountChange={handleTakerAmountChange}
              title="Taker Asset & Amount"
            />

            <SectionHeading>Full Swap Secret</SectionHeading>
            <NoteTextarea
              value={fullSwapSecret}
              onChange={handleFullSwapSecretChange}
             />
          </Box>

          <LoadingExtButton
            disabled={loading || !makerAmount || !makerAsset || !takerAmount || !takerAsset || !orderId || !fullSwapSecret || !isEmpty(error)}
            loading={loading}
            title={'Swap'}
            onClick={doTakerDeposit}
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
        actionTitle="Your swap is complete"
        tx={ethTx}
        openState={showSuccessModal}
        onClose={onReset}
      >
      </GeneralSuccessModal>
    </StyledCard>
  )
}
