import Card from '@mui/material/Card'
import Stack from '@mui/material/Stack'
import dayjs from 'dayjs'
import * as React from 'react'
import { AuthorIcon } from '../atoms/AuthorIcon'
import { Label } from '../atoms/Label'
import { MessageCardContent } from '../molecules/MessageCardContent'
import { ReactionData, Reactions } from '../molecules/Reactions'

interface MessageCardProps {
  UserDisplayName: string
  ChannelName: string
  IconImageUrl: string
  Message: string
  PostedDate: string
}

export const MessageCard = ({ ...props }: MessageCardProps) => {
  const publishAt = dayjs(props.PostedDate).format('YYYY年MM月DD日 HH:mm')

  return (
    <Card elevation={0}>
      <Stack
        direction="column"
        sx={{ padding: '16px 16px 0 16px' }}
        spacing={1}
      >
        <Label size="medium" color="light">
          {props.ChannelName}
        </Label>
        <Stack direction="row" spacing={1}>
          <AuthorIcon src={props.IconImageUrl} />
          <Stack direction="column" spacing={0.5}>
            <Label children={props.UserDisplayName} size="medium" weight="bold" />
            <MessageCardContent {...props} />
            {/* <Reactions data={props.reactions} /> */}
            <Label children={publishAt} size="small" color="light" />
          </Stack>
        </Stack>
      </Stack>
    </Card>
  )
}
