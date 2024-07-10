import numeral from 'numeral'


export const formatHash = (hash: string, chars = 6) => {
  return `${hash.substring(0, hash.length - chars)}...`
}

export const formatWalletHash = (txHash: string, chars = 6) => {
  return `${txHash.substring(0, chars + 2)}...${txHash.substring(
    txHash.length - chars,
  )}`
}

const hasScientificNotation = (number: string) => {
  // Use a regular expression to check if the string matches the scientific notation pattern.
  const scientificNotationPattern = /[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)/
  return scientificNotationPattern.test(number)
}

export const maskText = (text: string) => {
  const maskedChars = text.split('').map(() => '\u2022')
  return maskedChars.join('')
}

export const formatNumber = (num: number | string) => {
  let format = '0,0'
  if (Number(num) < 1) {
    if (hasScientificNotation(num.toString())) {
      return num
    } else {
      format = '0,0.00'
    }
  }

  return numeral(num).format(format)
}

export const formatContractError = (message: string) => {
  const formatMessage = message.toLowerCase()
  console.log('formatMessage', formatMessage)

  if (formatMessage.includes('user rejected'))
    return 'You rejected the action, please try again.'

  if (formatMessage.includes('invalid address'))
    return 'Please enter a correct address'

  if (formatMessage.includes('invalid BigNumber value'))
    return 'Please input a number value'

  if (formatMessage.includes('nonce has already been used'))
    return 'Please change the nonce number'

  if (formatMessage.includes('exceed deposit cap for the pool'))
    return 'The deposit cap for the pool is reached. The deposit is not allowed'

  if (formatMessage.includes('cannot estimate gas'))
    return 'Cannot estimate gas fee, transaction may fail or require manual gas limit'

  if (formatMessage.includes('insufficient funds'))
    return 'Insufficient funds'

  return 'An unexpected error occured, please try again'
}

export const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}${month}${day}${hours}${minutes}`;
}


export function formatTimestampInUTC(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hour = String(date.getUTCHours()).padStart(2, '0');
  const minute = String(date.getUTCMinutes()).padStart(2, '0');

  return `${day}/${month}/${year} ${hour}:${minute} UTC`;
}
