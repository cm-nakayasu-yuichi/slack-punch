import * as React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { Reactions } from './Reactions'

export default {
  title: 'Molecules/Reactions',
  component: Reactions,
} as ComponentMeta<typeof Reactions>

const Template: ComponentStory<typeof Reactions> = (args) => <Reactions {...args} />

export const Basic = Template.bind({})
Basic.args = {
  data: [
    { 
      src: 'https://emoji.slack-edge.com/T01LQBQK08Z/itsumoarigato/e7db3fd9d9e69b24.png',
      count: 3
    },
    {
      src: 'https://emoji.slack-edge.com/T01LQBQK08Z/emo_cracker/9f97ace6d9e7484d.gif',
      count: 25,
    },
    {
      src: 'https://a.slack-edge.com/production-standard-emoji-assets/13.0/apple-small/1f440@2x.png',
      count: 12,
    },
    { 
      src: 'https://emoji.slack-edge.com/T01LQBQK08Z/iine/b7449db1d953a375.png',
      count: 7
    },
    {
      src: 'https://emoji.slack-edge.com/T01LQBQK08Z/sasugada/3243651927eed392.png',
      count: 2,
    },
    {
      src: 'https://emoji.slack-edge.com/T01LQBQK08Z/oohashi/e5ba7101c4413431.gif',
      count: 192,
    },
    { 
      src: 'https://emoji.slack-edge.com/T01LQBQK08Z/emo_gogo/b060a34202ff7cdf.gif',
      count: 3
    },
    {
      src: 'https://emoji.slack-edge.com/T01LQBQK08Z/iina-/d43dbcf21e713a22.png',
      count: 2,
    },
    {
      src: 'https://emoji.slack-edge.com/T01LQBQK08Z/wwww/54c452774f42ff88.png',
      count: 9,
    },
    { 
      src: 'https://emoji.slack-edge.com/T01LQBQK08Z/tanoshisou/363d4620fd0c5213.gif',
      count: 4
    },
    { 
      src: 'https://emoji.slack-edge.com/T01LQBQK08Z/yomuna/43e58579c28c583a.png',
      count: 1
    },
    { 
      src: 'https://emoji.slack-edge.com/T01LQBQK08Z/kusa/301e5ebeef66ac0a.png',
      count: 12
    },
    { 
      src: 'https://emoji.slack-edge.com/T01LQBQK08Z/kawaii/5f231f55264a4849.png',
      count: 8
    },
  ]
}