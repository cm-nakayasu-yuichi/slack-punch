// src/App.jsx
import { AppBar, Toolbar, Typography, Box, Container } from '@mui/material';
import PostCard from './features/articles/components/article/PostCard';
import Header from './features/articles/components/common/Header';

const tweets = [
  {
    avatarUrl: 'https://ca.slack-edge.com/E01LQBQK08Z-UED43V933-9513d9986a58-512',
    username: '西田将幸 (nishida masayuki)',
    content: '岩田さんの方が金持ちなので岩田さんにお願いします',
    date: '2024-10-10',
  },
  {
    avatarUrl: 'https://ca.slack-edge.com/E01LQBQK08Z-U8B56MZT7-2b47dbc06171-512',
    username: '濱田孝治 Hamada Koji ハマコー',
    content: '西田さん、実家が太いから騙されちゃ駄目ですよ。西田ビルとか、10本ぐらいあるし。',
    date: '2024-10-10',
  },
  // 追加のダミーデータ
  {
    avatarUrl: 'https://ca.slack-edge.com/E01LQBQK08Z-UED43V933-9513d9986a58-512',
    username: '西田将幸 (nishida masayuki)',
    content: '西田ビルは1本ですw',
    date: '2024-10-10',
  },
  {
    avatarUrl: 'https://ca.slack-edge.com/E01LQBQK08Z-UJFD2EWNQ-103eb6e768a4-512',
    username: 'おく',
    content: '豆知識: 世界の油田の半分は西田さんが保有している',
    date: '2024-10-10',
  },
  {
    avatarUrl: 'https://ca.slack-edge.com/E01LQBQK08Z-UED43V933-9513d9986a58-512',
    username: '西田将幸 (nishida masayuki)',
    content: '油田の半分保有してたら仕事してません。毎日アニメ見て過ごします',
    date: '2024-10-10',
  },
  {
    avatarUrl: 'https://ca.slack-edge.com/E01LQBQK08Z-U8C2T7V9V-8a0cbf671a52-512',
    username: '大橋力丈(Rikitake Ohashi)',
    content: 'アニメも石油も尽きるよ',
    date: '2024-10-10',
  },
  {
    avatarUrl: 'https://ca.slack-edge.com/E01LQBQK08Z-UF733SS9W-gae255d28268-512',
    username: '山田良 (yamada ryo)',
    content: '個人アプリはGitHubのPagesでやってた気がする。コーヒーアプリはS3かなんかにおいてアプリでWebViewを表示する形式。コーヒー屋さんは利用規約に更新があっても強制表示はしていないけど、やるなら仕組みをアプリ側にもスクラッチで作る必要あり。アプリ側は利用規約はURLだけ教えてもらってリンクをアプリ内で開けるようにだけして基本ノータッチ。ただ、アプリ利用開始時には利用規約を強制的に表示して、同意がないと先に進めなくしてる。',
    date: '2024-10-10',
  },
];

function App() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header></Header>


      {/* Content */}
      <Container sx={{ flex: 1, width: '100vw', p: 2 }}>
        {tweets.map((tweet, index) => (
          <PostCard
            key={index}
            avatarUrl={tweet.avatarUrl}
            username={tweet.username}
            content={tweet.content}
            date={tweet.date}
          />
        ))}
      </Container>

      {/* Footer */}
      <Box component="footer" sx={{ py: 2, textAlign: 'center', bgcolor: 'background.paper', width: '100vw' }}>
        <Typography variant="body2" color="textSecondary">
          © 2024 slack punch
        </Typography>
      </Box>
    </Box>
  );
}

export default App;