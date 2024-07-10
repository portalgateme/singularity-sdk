import styled from 'styled-components'

export const Column = styled.div<{
  // gap?: Gap | string
  flex?: string
}>`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  ${({ flex }) => flex && `flex: ${flex};`}
`
export const ColumnCenter = styled(Column)`
  width: 100%;
  align-items: center;
`

export const AutoColumn = styled.div<{
  gap?: string
  justify?:
    | 'stretch'
    | 'center'
    | 'start'
    | 'end'
    | 'flex-start'
    | 'flex-end'
    | 'space-between'
  grow?: true
}>`
  display: grid;
  grid-auto-rows: auto;
  justify-items: ${({ justify }) => justify && justify};
  flex-grow: ${({ grow }) => grow && 1};
`

export default Column

//    grid-row-gap: ${({ theme }) =>
// (gap && theme.grids[gap as Gap]) || gap};
