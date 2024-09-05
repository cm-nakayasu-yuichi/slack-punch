import * as React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { AuthorIcon } from './AuthorIcon'

export default {
  title: 'Atoms/AuthorIcon',
  component: AuthorIcon,
} as ComponentMeta<typeof AuthorIcon>

const Template: ComponentStory<typeof AuthorIcon> = (args) => <AuthorIcon {...args} />

export const Yasty = Template.bind({})
Yasty.args = {
  src: 'https://ca.slack-edge.com/T01THTR0N1M-U01TZ2A51H9-3af19473b933-72',
}

export const Dosupapa = Template.bind({})
Dosupapa.args = {
  src: "https://ca.slack-edge.com/T01THTR0N1M-U022LDQDQ4X-13e3ec165482-72",
}

export const Honbuchou = Template.bind({})
Honbuchou.args = {
  src: "https://ca.slack-edge.com/T01THTR0N1M-U01UNKFMS3S-fd5dfb8a0af1-72",
}