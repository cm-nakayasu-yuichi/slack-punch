import { Typography } from "@mui/material";

interface HeaderLogoProps {
    title: String;
}

export const HeaderLogo = ({
    title
}: HeaderLogoProps) => {
    return (
        <Typography
            variant="h6"
            component="div"
            sx={{
                flexGrow: 1,
                textAlign: 'left'
            }}
        >
            {title}
        </Typography>
    );
};