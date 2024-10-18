import React from 'react';
import { Avatar, Card, CardContent, Typography, Box, Link } from '@mui/material';

interface AuthorCardProps {
  avatarUrl: string;
  username: string;
}

const AuthorCard: React.FC<AuthorCardProps> = ({ avatarUrl, username }) => {
    return (
      <Card sx={{ mb: 2 }}>
        <CardContent>

            <Typography variant="h6" gutterBottom>
                この記事をまとめた人
            </Typography>
            <Avatar alt="まとめた人" src={avatarUrl} sx={{ mb: 1 }} />
            <Typography variant="body1">
                {username}
            </Typography>
            <Link href="#" variant="body2" sx={{ display: 'block', mt: 1 }}>
                この人のまとめた記事一覧
            </Link>

        </CardContent>
      </Card>
    );
  };

export default AuthorCard;