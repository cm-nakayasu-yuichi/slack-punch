import * as React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { Label } from './Label'

export default {
  title: 'Atoms/Label',
  component: Label,
} as ComponentMeta<typeof Label>

const Template: ComponentStory<typeof Label> = (args) => <Label {...args} />

export const ExtraLarge = Template.bind({})
ExtraLarge.args = {
  weight: 'bold',
  size: 'extra-large',
  color: 'regular',
}

export const Large = Template.bind({})
Large.args = {
  weight: 'regular',
  size: 'extra-large',
  color: 'regular',
}

export const Medium = Template.bind({})
Medium.args = {
  weight: 'regular',
  size: 'medium',
  color: 'regular',
}

export const Small = Template.bind({})
Small.args = {
  weight: 'regular',
  size: 'small',
  color: 'regular',
}

export const ExtraSmall = Template.bind({})
ExtraSmall.args = {
  weight: 'regular',
  size: 'extra-small',
  color: 'light',
}