import * as React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { MessageCard } from './MessageCard'

export default {
  title: 'Molecules/MessageCard',
  component: MessageCard,
} as ComponentMeta<typeof MessageCard>

const Template: ComponentStory<typeof MessageCard> = (args) => <MessageCard {...args} />

export const Basic = Template.bind({})
Basic.args = {
  
}