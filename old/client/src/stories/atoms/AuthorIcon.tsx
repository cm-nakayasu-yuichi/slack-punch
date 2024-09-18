import * as React from 'react'
import Avatar from '@mui/material/Avatar'

interface AuthorIconProps {
  src: string
  onClick?: () => void
}

export const AuthorIcon = ({
  src,
  ...props
}: AuthorIconProps) => {
  return (
    <Avatar
      src={src}
      variant='square'
      sx={{ width: 36, height: 36 }}
      {...props}
    />
  )
}