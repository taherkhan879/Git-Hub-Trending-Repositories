import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  Alert,
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
  Container,
  CssBaseline,
  ThemeProvider,
  Typography,
  createTheme,
} from '@mui/material'

import Header from './components/Header'
import DateFilter from './components/DateFilter'
import RepositoryCard from './components/RepositoryCard'
import RepositoryDetails from './components/RepositoryDetails'

import {
  fetchRepositoriesRequest,
  setSelectedPeriod,
} from './redux/repositorySlice'

const themes = {
  light: {
    mode: 'light',
    primary: '#1976d2',
    background: '#f5f7fa',
    paper: '#ffffff',
    text: '#17202a',
  },
  dark: {
    mode: 'dark',
    primary: '#90caf9',
    background: '#121212',
    paper: '#1e1e1e',
    text: '#f5f5f5',
  },
  hacker: {
    mode: 'dark',
    primary: '#39ff14',
    background: '#050805',
    paper: '#0b120b',
    text: '#39ff14',
  },
}

const App = () => {
  const dispatch = useDispatch()

  const [selectedRepository, setSelectedRepository] = useState(null)

  const [selectedTheme, setSelectedTheme] = useState(() => {
    return localStorage.getItem('github-app-theme') || 'light'
  })

  const {
    items,
    loading,
    error,
    page,
    hasMore,
    selectedPeriod,
  } = useSelector(state => state.repositories)

  const colors = themes[selectedTheme] || themes.light

  const muiTheme = createTheme({
    palette: {
      mode: colors.mode,
      primary: {
        main: colors.primary,
      },
      background: {
        default: colors.background,
        paper: colors.paper,
      },
      text: {
        primary: colors.text,
      },
    },
    shape: {
      borderRadius: 10,
    },
  })

  useEffect(() => {
    dispatch(
      fetchRepositoriesRequest({
        page: 1,
        days: selectedPeriod,
      }),
    )
  }, [dispatch, selectedPeriod])

  useEffect(() => {
    localStorage.setItem('github-app-theme', selectedTheme)
  }, [selectedTheme])

  const handlePeriodChange = days => {
    dispatch(setSelectedPeriod(Number(days)))
  }

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      dispatch(
        fetchRepositoriesRequest({
          page: page + 1,
          days: selectedPeriod,
        }),
      )
    }
  }

  const handleRepositorySelect = repository => {
    setSelectedRepository(repository)
  }

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />

      <Box
        className={`app-theme theme-${selectedTheme}`}
        sx={{
          minHeight: '100vh',
          backgroundColor: 'background.default',
          color: 'text.primary',
          transition: 'background-color 0.25s, color 0.25s',
        }}
      >
        <Header />

        <Container maxWidth="md" sx={{ pt: 2 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: 1,
              flexWrap: 'wrap',
              mb: 2,
            }}
          >
            <Typography variant="body2">
              Theme:
            </Typography>

            <ButtonGroup size="small" variant="outlined">
              <Button
                onClick={() => setSelectedTheme('light')}
                variant={
                  selectedTheme === 'light' ? 'contained' : 'outlined'
                }
                aria-pressed={selectedTheme === 'light'}
              >
                ☀️ Light
              </Button>

              <Button
                onClick={() => setSelectedTheme('dark')}
                variant={
                  selectedTheme === 'dark' ? 'contained' : 'outlined'
                }
                aria-pressed={selectedTheme === 'dark'}
              >
                🌙 Dark
              </Button>

              <Button
                onClick={() => setSelectedTheme('hacker')}
                variant={
                  selectedTheme === 'hacker' ? 'contained' : 'outlined'
                }
                aria-pressed={selectedTheme === 'hacker'}
              >
                💚 Hacker
              </Button>
            </ButtonGroup>
          </Box>
        </Container>

        {selectedRepository ? (
          <RepositoryDetails
            repository={selectedRepository}
            onBack={() => setSelectedRepository(null)}
          />
        ) : (
          <Container maxWidth="md" sx={{ py: 4 }}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Explore Trending Repositories
              </Typography>

              <Typography color="text.secondary" sx={{ mb: 3 }}>
                Discover recently created GitHub repositories with the
                most stars.
              </Typography>

              <DateFilter
                selectedPeriod={selectedPeriod}
                onPeriodChange={handlePeriodChange}
              />
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {items.map(repository => (
              <RepositoryCard
                key={repository.id}
                repository={repository}
                onSelect={handleRepositorySelect}
              />
            ))}

            {loading && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  py: 4,
                }}
              >
                <CircularProgress />
              </Box>
            )}

            {!loading && !error && items.length === 0 && (
              <Typography textAlign="center" sx={{ py: 4 }}>
                No repositories found for this period.
              </Typography>
            )}

            {!loading && hasMore && items.length > 0 && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  mt: 4,
                }}
              >
                <Button
                  variant="contained"
                  onClick={handleLoadMore}
                >
                  Load More Repositories
                </Button>
              </Box>
            )}

            {!loading && items.length > 0 && !hasMore && (
              <Typography
                textAlign="center"
                color="text.secondary"
                sx={{ py: 3 }}
              >
                You've reached the end of the available results.
              </Typography>
            )}
          </Container>
        )}
      </Box>
    </ThemeProvider>
  )
}

export default App
