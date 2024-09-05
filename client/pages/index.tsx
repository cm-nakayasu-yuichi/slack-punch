import { gql, useQuery } from '@apollo/client'
import Head from 'next/head'
// import data from '../src/data/dummy.json'
import { MessageCard } from '../src/stories/molecules/MessageCard'
import styles from '../styles/Home.module.css'

interface Blown {
  UserDisplayName: string
  ChannelName: string
  IconImageUrl: string
  Message: string
  PostedDate: string
}

interface BlownData {
  listMessages: { items: Blown[] }
}

const MESSAGES = gql`
query GetMessages {
  listMessages {
    items {
      UserDisplayName
      ChannelName
      IconImageUrl
      Message
      PostedDate
    }
  }
}
`;

export default function Home() {
  debugger
  const { loading, error, data } = useQuery<BlownData>(MESSAGES)
  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :(</p>
  if (data === undefined) return <p>No data</p>
  
  return (
    <div className={styles.container}>
      <Head>
        <title>Slack Punch</title>
      </Head>

      <main className={styles.main}>
        {data.listMessages.items.map(function (elem) {
          return <MessageCard key={elem.PostedDate} {...elem} />
        })}
      </main>

      <footer className={styles.footer}>
        <p>Powered by やすてぃ</p>
      </footer>
    </div>
  )
}
