import AccountCircle from '@mui/icons-material/AccountCircle'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import * as React from 'react'
import { SearchForm } from '../atoms/SearchForm'
import { color } from '../theme'

interface HeaderProps {}

export const Header = ({ ...props }: HeaderProps) => {
  return (
    <AppBar sx={{ backgroundColor: color.main[1] }}>
      <Toolbar>
        <Typography
          variant="h6"
          noWrap
          sx={{
            color: color.black[3],
            marginRight: 3,
          }}
        >
          Slack Punch
        </Typography>
        <Box sx={{ flexGrow: 1 }}>
          <SearchForm />
        </Box>
        <Box>
          <IconButton size="large" edge="end" sx={{ color: color.black[3] }}>
            <AccountCircle />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
