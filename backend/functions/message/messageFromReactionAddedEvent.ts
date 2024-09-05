import { ReactionAddedEvent } from "@slack/bolt"
import { WebClient } from "@slack/web-api"
import { Message } from "../../entities/Message"
import { tsToDate } from "../date"
import { safeString } from "../string"

export async function messageFromReactionAddedEvent(event: ReactionAddedEvent, client: WebClient): Promise<Message|null> {
  try {

    if (!('channel' in event.item)) {
      throw new Error('channel is not found.')
    }

    if (!('ts' in event.item)) {
      throw new Error('ts is not found.')
    }

    if (!('event_ts' in event)) {
      throw new Error('event_ts is not found.')
    }

    const channelId = event.item.channel
    const timestamp = event.item.ts

    // チャンネル情報取得
    const channelInfo = await client.conversations.info({
      token: process.env.SLACK_BOT_TOKEN,
      channel: channelId
    })

    // メッセージ情報取得
    const history = await client.conversations.history({
      token: process.env.SLACK_BOT_TOKEN,
      channel: channelId,
      latest: timestamp,
      inclusive: true,
      limit: 1
    })
    
    if (history.messages === undefined || history.messages.length === 0) {
      throw new Error('message is not found.')
    }
    
    // 投稿ユーザ情報の取得
    const itemUserInfo = await client.users.info({
      user: event.item_user
    })
    if (!itemUserInfo.ok) {
      throw new Error('item user info is invalid.')
    }

    // SlackPunchしたユーザ情報の取得
    const blowUserInfo = await client.users.info({
      user: event.user
    })
    if (!blowUserInfo.ok) {
      throw new Error('blow user info is invalid.')
    }

    const message = {
      userId: safeString(itemUserInfo.user?.id),
      userDisplayName: safeString(itemUserInfo.user?.profile?.display_name),
      iconImageUrl: safeString( itemUserInfo.user?.profile?.image_72),
      channelId,
      timestamp,
      postedDate: tsToDate(timestamp),
      blownDate: tsToDate(event.event_ts),
      channelName: safeString(channelInfo.channel?.name),
      message: safeString(history.messages[0].text),
      blowUserDisplayName: safeString(blowUserInfo.user?.profile?.display_name),
      blowUserId: safeString(blowUserInfo.user?.id)
    }
    
    return message
  } catch (error) {
    console.error("ERROR messageFromReactionAddEvent: ", error)
    return null
  } 
}