import { Header } from "../ui/header";
import { Footer } from "../ui/footer";
import { Box } from "@mui/material";

interface ContentLayoutProps {
    // title: String;
    children: React.ReactNode;
};

export const ContentLayout = ({
    // title,
    children
}: ContentLayoutProps) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />
            {children}
            <Footer />
        </Box>
    );
}