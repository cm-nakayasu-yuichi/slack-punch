import React from 'react';
import { Avatar, Card, CardContent, Typography, Box } from '@mui/material';

interface PostCardProps {
  avatarUrl: string;
  username: string;
  content: string;
  date: string;
}

const PostCard: React.FC<PostCardProps> = ({ avatarUrl, username, content, date }) => {
    return (
      <Card sx={{ mb: 2 }}>
        <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Avatar alt={username} src={avatarUrl} sx={{ mr: 2 }} />
                <Box sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {username}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                    {date}
                </Typography>
            </Box>
            <Typography variant="body1">
                {content}
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                in #times-yamada-ryo
            </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  };

export default PostCard;