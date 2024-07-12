import { HexData } from '../types'
import { useSignTypedData } from 'wagmi'

export const useSignMessage = () => {
  const { signTypedDataAsync } = useSignTypedData()

  const signMessageAsync = async (user: HexData) => {
    return await signTypedDataAsync({
      types: {
        'Zero Knowledge Proof Key Creation': [
          { name: 'user', type: 'address' },
          { name: 'action', type: 'string' },
          { name: 'disclaimer', type: 'string' },
        ],
      },
      primaryType: 'Zero Knowledge Proof Key Creation',
      message: {
        user,
        action:
          "Please sign this message to create your own Zero Knowledge proof key-pair. This doesn't cost you anything and is free of any gas fees.",
        disclaimer: 'Only sign this message on singularity website!',
      },
    })
  }

  return { signMessageAsync }
}