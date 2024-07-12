import {
  Box,
  Card,
  FormControl,
  styled,
  Typography,
  useTheme,
} from '@mui/material'
import BN from 'bignumber.js'
import { isEmpty } from 'lodash'
import React, { useState } from 'react'
import { useAccount } from 'wagmi'
import { config } from '../../constants'
import { useToast } from '../../contexts/ToastContext/hooks'
import { formatContractError } from '../../helpers'
import { useDeposit } from '../../hooks/useDeposit'
import { useSignMessage } from '../../hooks/useSignMessage'
import { DarkpoolError, TokenConfig } from '../../types'
import { AlignedRow } from '../Box/AlignedRow'
import { LoadingExtButton } from '../Button/LoadingButton'
import { AssetAmountInput } from '../Input/AssetAmountInput'
import { GeneralSuccessModal } from '../Modal/GeneralSuccessModal'
import { tokenConfig } from '../../constants/tokenConfig'

export const StyledCard = styled(Card)(() => {
  return {
    boxShadow: 'none',
    width: '648px',
    minHeight: '265px',
  }
})

export const DemoCard: React.FC = () => {
  const theme = useTheme()
  const { signMessageAsync } = useSignMessage()
  const [loading, setLoading] = useState(false)
  const { showPendingToast, showSuccessToast, closeToast } =
    useToast()
  const [error, setError] = useState<string | null>(null)
  const {
    address,
    connector: activeConnector,
    isConnected,
  } = useAccount()
  const chainId = config.chainId
  const [signature, setSignature] = useState<string | null>(null)
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false)
  const [key, setKey] = useState<number>(Date.now())
  const account = useAccount()

  const [asset, setAsset] = useState<TokenConfig>(tokenConfig[chainId][0])
  const [amount, setAmount] = useState<number>()
  const { execute } = useDeposit()

  const [ethTx, setEthTx] = useState<string>('')

  const handleAssetChange = (value: TokenConfig) => {
    setError(null)
    setAsset(value)
  }

  const handleAmountChange = (value: string) => {
    setError(null)
    if (!isNaN(Number(value))) {
      const amount = parseFloat(value)
      if (amount <= 0) {
        setError('Amount must be greater than 0')
        return
      }
      setAmount(parseFloat(value))
    } else {
      setAmount(undefined)
    }
  }

  const onReset = () => {
    console.log('onreset')
    setShowSuccessModal(false)
    setKey(Date.now())
  }

  const prepare = async () => {
    if (!amount || !asset) {
      setError('Please enter the amount and select a token')
      return
    }

    if (!isConnected || !activeConnector || !address || !chainId) {
      setError('No wallet connected!')
      return
    }

    const amountBN = BigInt(
      new BN(amount).multipliedBy(new BN(10).pow(asset.decimals)).toFixed(0, 1),
    )

    setError(null)
    setLoading(true)

    try {
      await execute(
        asset,
        amountBN,
      )
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
            <AssetAmountInput
              onAssetChange={handleAssetChange}
              onAmountChange={handleAmountChange}
            />
          </Box>

          <LoadingExtButton
            disabled={loading || !amount || !asset || !isEmpty(error)}
            loading={loading}
            title={'Continue'}
            onClick={prepare}
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
        actionTitle="Your deposit is complete"
        tx={ethTx}
        openState={showSuccessModal}
        onClose={onReset}
      >
        <AlignedRow>
          <Typography variant="body-sm">You Deposit:</Typography>
          <Typography variant="body-sm" fontWeight={600}>
            {amount?.toFixed(3)} {asset?.symbol || ''}
          </Typography>
        </AlignedRow>
      </GeneralSuccessModal>
    </StyledCard>
  )
}
