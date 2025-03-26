import {
  Box,
  Card,
  FormControl,
  styled,
  Typography,
  useTheme
} from '@mui/material'
import { isEmpty } from 'lodash'
import React, { useState } from 'react'
import { useAccount } from 'wagmi'
import { config } from '../../constants'
import { useToast } from '../../contexts/ToastContext/hooks'
import { useAerodromeAddLp } from '../../hooks/useAerodromeAddLp'
import { LoadingExtButton } from '../Button/LoadingButton'
import { GeneralSuccessModal } from '../Modal/GeneralSuccessModal'

export const StyledCard = styled(Card)(() => {
  return {
    boxShadow: 'none',
    width: '648px',
    minHeight: '265px',
  }
})

export const DemoAerodromeAddLpCard: React.FC = () => {
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


  const [ethTx, setEthTx] = useState<string>('')

  const { execute } = useAerodromeAddLp()

  const onReset = () => {
    console.log('onreset')
    setShowSuccessModal(false)
    setKey(Date.now())
  }

  const doSwap = async () => {
    if (!isConnected || !activeConnector || !address || !chainId) {
      setError('No wallet connected!')
      return
    }

    setError(null)
    setLoading(true)

    try {
      await execute()
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
          <LoadingExtButton
            disabled={loading || !isEmpty(error)}
            loading={loading}
            title={'LP'}
            onClick={doSwap}
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
