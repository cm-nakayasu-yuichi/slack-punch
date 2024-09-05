import { App, AwsLambdaReceiver } from '@slack/bolt'
import { AwsCallback, AwsEvent } from '@slack/bolt/dist/receivers/AwsLambdaReceiver'
import * as AWS from 'aws-sdk'
import { messageFromReactionAddedEvent } from './functions/message/messageFromReactionAddedEvent'
import { putMessageToStorage } from './functions/storage/putMessageToStorage'

if (process.env.SLACK_SIGNING_SECRET === undefined) {
  throw new Error('SLACK_SIGNING_SECRET is undefined.')
}

AWS.config.update({
  region: 'ap-northeast-1'
})

const awsLambdaReceiver = new AwsLambdaReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET
})

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  receiver: awsLambdaReceiver,
  processBeforeResponse: true
});

app.event('reaction_added', async({event, client, logger}) => {
  // TODO: リアクション名を定数化する
  if (event.reaction != "slack-punch") {
    return
  }

  const message = await messageFromReactionAddedEvent(event, client)
  if (message !== null) {
    await putMessageToStorage(message)
  } 
});

(async () => {
  // Start your app
  await app.start(3000);
  
  console.log('⚡️ Bolt app is running!');
})();

module.exports.handler = async(event: AwsEvent, context: any, callback: AwsCallback) => {
  const handler = await awsLambdaReceiver.start()
  return handler(event, context, callback)
}