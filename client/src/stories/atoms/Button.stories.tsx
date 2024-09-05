import * as React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { Button } from './Button'

export default {
  title: 'Atoms/Button',
  component: Button,
} as ComponentMeta<typeof Button>

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />

export const Primary = Template.bind({})
Primary.args = {
  children: 'プライマリーボタン',
  mode: 'primary'
}

export const Secondary = Template.bind({})
Secondary.args = {
  children: 'セカンダリーボタン',
  mode: 'secondary'
}