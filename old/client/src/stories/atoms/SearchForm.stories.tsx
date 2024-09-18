import * as React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { SearchForm } from './SearchForm'

export default {
  title: 'Atoms/SearchForm',
  component: SearchForm,
} as ComponentMeta<typeof SearchForm>

const Template: ComponentStory<typeof SearchForm> = (args) => <SearchForm {...args} />

export const Basic = Template.bind({})
Basic.args = {
  
}