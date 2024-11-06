import { Typography, Box } from '@mui/material'

export const Footer = () => {
    return (
        <Box component="footer" sx={{ py: 2, textAlign: 'center', bgcolor: 'background.paper', width: '100vw' }}>
            <Typography variant="body2" color="textSecondary">
                © 2024 slack punch
            </Typography>
        </Box>
    );
};