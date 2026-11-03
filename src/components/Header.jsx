import { AppBar, Toolbar, Typography } from '@mui/material'
import GitHubIcon from '@mui/icons-material/GitHub'

const Header = () => {
  return (
    <AppBar position="static" elevation={0}>
      <Toolbar>
        <GitHubIcon sx={{ mr: 2, fontSize: 32 }} />

        <Typography variant="h6" component="h1" fontWeight="bold">
          GitHub Trending Repositories
        </Typography>
      </Toolbar>
    </AppBar>
  )
}

export default Header