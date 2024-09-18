import CardMedia from '@mui/material/CardMedia'
import Link from '@mui/material/Link'
import Stack from '@mui/material/Stack'
import * as React from 'react'
import reactStringReplace from 'react-string-replace'
import { Label } from '../atoms/Label'

interface MessageCardContentProps {
  Message: string
}

export const MessageCardContent = ({ ...props }: MessageCardContentProps) => {
  // URL文字列をリンクに変換
  let body = reactStringReplace(props.Message, /(https?:\/\/\S+)/g, (match, i) => (
    <Link href={match} underline="hover">
      {match}
    </Link>
  ))

  return (
    <Stack direction="column" spacing={1}>
      <Label children={body} size="medium" />
      <CardMedia
        component="img"
        src="https://picsum.photos/400/300"
        sx={{ display: 'none' }} // 一時的にdisplay:none
      />
    </Stack>
  )
}
