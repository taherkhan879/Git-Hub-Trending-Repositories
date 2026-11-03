import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Link,
  Stack,
  Typography,
} from '@mui/material'

import StarIcon from '@mui/icons-material/Star'
import BugReportIcon from '@mui/icons-material/BugReport'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'

const RepositoryCard = ({ repository, onSelect }) => {
  const {
    name,
    full_name,
    description,
    stargazers_count,
    open_issues_count,
    owner,
    html_url,
  } = repository

  return (
    <Card
      elevation={0}
      sx={{
        mb: 2,
        border: '1px solid #e0e0e0',
        borderRadius: 3,
        transition: '0.2s',
        '&:hover': {
          borderColor: '#1976d2',
          boxShadow: 2,
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
        >
          <Avatar
            src={owner.avatar_url}
            alt={owner.login}
            sx={{ width: 56, height: 56 }}
          />

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h6" fontWeight="bold">
              <Link
                component="button"
                underline="hover"
                onClick={() => onSelect(repository)}
                sx={{ textAlign: 'left', fontWeight: 'bold' }}
              >
                {full_name || name}
              </Link>
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Owner: {owner.login}
            </Typography>

            <Typography
              variant="body2"
              sx={{ mt: 1, overflowWrap: 'anywhere' }}
            >
              {description || 'No description provided.'}
            </Typography>

            <Stack
              direction="row"
              spacing={1}
              useFlexGap
              flexWrap="wrap"
              sx={{ mt: 2 }}
            >
              <Chip
                icon={<StarIcon />}
                label={`${stargazers_count.toLocaleString()} stars`}
                size="small"
                color="warning"
                variant="outlined"
              />

              <Chip
                icon={<BugReportIcon />}
                label={`${open_issues_count.toLocaleString()} issues`}
                size="small"
                variant="outlined"
              />

              <Chip
                label="View activity"
                size="small"
                color="primary"
                onClick={() => onSelect(repository)}
                clickable
              />

              <Chip
                icon={<OpenInNewIcon />}
                label="GitHub"
                size="small"
                component="a"
                href={html_url}
                target="_blank"
                rel="noreferrer"
                clickable
              />
            </Stack>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default RepositoryCard