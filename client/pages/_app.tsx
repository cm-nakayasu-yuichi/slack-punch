import { AppProps } from 'next/app'
import Box from '@mui/material/Box'
import { Header } from '../src/stories/molecules/Header'
import '../styles/globals.css'
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  ApolloLink, 
  createHttpLink
} from '@apollo/client'
import { createAuthLink } from 'aws-appsync-auth-link'

const authConfig = {
  url: 'https://wyyq7y7cofbp7majyuvoyoul4i.appsync-api.ap-northeast-1.amazonaws.com/graphql',
  region: 'ap-northeast-1',
  auth: {
    type: 'API_KEY',
    apiKey: 'da2-rx4u25cfwfdgzazbl7ojl7iori'
  }
}

const link = ApolloLink.from([
  // @ts-ignore
  createAuthLink(authConfig),
  createHttpLink({uri: authConfig.url})
])

function MyApp({ Component, pageProps }: AppProps) {
  const client = new ApolloClient({
    link,
    cache: new InMemoryCache()
  })

  return (
    <ApolloProvider client={client}>
      <Box>
        <Header />
        <Component {...pageProps} />
      </Box>
    </ApolloProvider>
  )
}

export default MyApp
