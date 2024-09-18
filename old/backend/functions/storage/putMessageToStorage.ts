import * as AWS from 'aws-sdk'
import { dateToISOString } from "../date"
import { safeParseFloat, safeString } from "../string"
import { Message } from "../../entities/Message"

AWS.config.update({
  region: 'ap-northeast-1'
})

interface DynamoMessageItem {
  UserId: string
  Timestamp: number
  UserDisplayName: string
  IconImageUrl: string
  ChannelId: string
  ChannelName: string
  PostedDate: string
  Message: string
  BlownDate: string
  BlowUserDisplayName: string
  BlowUserId: string
}

function messageToDynamoMessageItem(message: Message): DynamoMessageItem {
  return {
    UserId: message.userId,
    Timestamp: safeParseFloat(message.timestamp),
    UserDisplayName: message.userDisplayName,
    IconImageUrl: message.iconImageUrl,
    ChannelId: message.channelId,
    ChannelName: message.channelName,
    PostedDate: dateToISOString(message.postedDate),
    Message: message.message,
    BlownDate: dateToISOString(message.blownDate),
    BlowUserDisplayName: message.blowUserDisplayName,
    BlowUserId: message.blowUserId
  }
}

export async function putMessageToStorage(message: Message): Promise<void> {
  try {
    const dynamoDB = new AWS.DynamoDB.DocumentClient
    const params = {
      Item: messageToDynamoMessageItem(message),
      TableName: 'Message'
    }
    const result = await dynamoDB.put(params).promise()
    console.info("SUCEESS storageMessage: ", result)
  } catch (error) {
    console.error("ERROR storageMessage: ", error)
  }
}