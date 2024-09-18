import * as React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { Reaction } from './Reaction'

export default {
  title: 'Molecules/Reaction',
  component: Reaction,
} as ComponentMeta<typeof Reaction>

const Template: ComponentStory<typeof Reaction> = (args) => <Reaction {...args} />

export const Arigato = Template.bind({})
Arigato.args = {
  src: 'https://emoji.slack-edge.com/T01LQBQK08Z/itsumoarigato/e7db3fd9d9e69b24.png',
  count: 3,
}

export const Cracker = Template.bind({})
Cracker.args = {
  src: 'https://emoji.slack-edge.com/T01LQBQK08Z/emo_cracker/9f97ace6d9e7484d.gif',
  count: 19,
}

export const Eyes = Template.bind({})
Eyes.args = {
  src: 'https://a.slack-edge.com/production-standard-emoji-assets/13.0/apple-small/1f440@2x.png',
  count: 192,
}