import * as React from 'react'
import Chip from '@mui/material/Chip'
import Avatar from '@mui/material/Avatar'
import { Label } from '../atoms/Label'

interface ReactionProps {
  src: string
  count: number
  onClick?: () => void
}

export const Reaction = ({ src, count, ...props }: ReactionProps) => {
  const countString = `${count}`
  return (
    <Chip
      avatar={<Avatar src={src} variant="square" />}
      label={
        <Label size="extra-small" color="light">
          {countString}
        </Label>
      }
      size="small"
      sx={{
        borderRadius: 2.5,
        '& .MuiChip-label': {
          paddingLeft: 1,
          paddingRight: 0.8,
        },
      }}
    />
  )
}
