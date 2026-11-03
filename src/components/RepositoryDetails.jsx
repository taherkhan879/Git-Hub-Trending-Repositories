import { useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material'

import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

const RepositoryDetails = ({ repository, onBack }) => {
  const [metric, setMetric] = useState('commits')
  const [activity, setActivity] = useState({
    frequency: [],
    commits: [],
    contributors: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    const fetchStats = async () => {
      setLoading(true)
      setError('')

      const { owner, name } = repository
      const baseUrl = `https://api.github.com/repos/${owner.login}/${name}`

      const fetchWithRetry = async url => {
        for (let attempt = 0; attempt < 4; attempt++) {
          const response = await fetch(url)

          // GitHub may need time to calculate repository statistics.
          if (response.status === 202) {
            await new Promise(resolve => setTimeout(resolve, 1500))
            continue
          }

          if (!response.ok) {
            throw new Error(
              `GitHub API request failed (${response.status}).`,
            )
          }

          return response.json()
        }

        throw new Error(
          'GitHub is still calculating these statistics. Please try again later.',
        )
      }

      try {
        const [frequency, commits, contributors] = await Promise.all([
          fetchWithRetry(`${baseUrl}/stats/code_frequency`),
          fetchWithRetry(`${baseUrl}/stats/commit_activity`),
          fetchWithRetry(`${baseUrl}/stats/contributors`),
        ])

        if (cancelled) return

        setActivity({
          frequency: Array.isArray(frequency) ? frequency : [],
          commits: Array.isArray(commits) ? commits : [],
          contributors: Array.isArray(contributors) ? contributors : [],
        })
      } catch (err) {
        if (!cancelled) {
          setError(err.message)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchStats()

    return () => {
      cancelled = true
    }
  }, [repository])

  const getWeeklyData = () => {
    if (metric === 'commits') {
      return activity.commits.map(week => [
        week.week * 1000,
        week.total,
      ])
    }

    return activity.frequency.map(week => [
      week[0] * 1000,
      Math.abs(week[metric === 'additions' ? 1 : 2]),
    ])
  }

  const totalOptions = {
    chart: {
      type: 'line',
      height: 320,
    },
    title: {
      text: `Total Weekly ${metric}`,
    },
    xAxis: {
      type: 'datetime',
      title: {
        text: 'Week starting',
      },
      labels: {
        format: '{value:%e %b %Y}',
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: `Number of ${metric}`,
      },
    },
    tooltip: {
      xDateFormat: '%A, %e %B %Y',
      shared: true,
    },
    series: [
      {
        name: `Total ${metric}`,
        data: getWeeklyData(),
      },
    ],
    credits: {
      enabled: false,
    },
  }

  const contributorOptions = {
    chart: {
      type: 'line',
      height: 420,
    },
    title: {
      text: `Weekly ${metric} by Contributor`,
    },
    xAxis: {
      type: 'datetime',
      title: {
        text: 'Week starting',
      },
      labels: {
        format: '{value:%e %b %Y}',
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: `Number of ${metric}`,
      },
    },
    tooltip: {
      shared: false,
      xDateFormat: '%A, %e %B %Y',
      pointFormat:
        '<b>{series.name}</b><br/>' +
        'Week: {point.key:%e %b %Y}<br/>' +
        `${metric}: <b>{point.y}</b>`,
    },
    plotOptions: {
      series: {
        marker: {
          enabled: false,
        },
      },
    },
    legend: {
      enabled: true,
    },
    series: activity.contributors
      .filter(contributor => contributor.weeks?.length)
      .map(contributor => ({
        name: contributor.author?.login || 'Unknown contributor',
        data: contributor.weeks
          .filter(week => week.w)
          .map(week => [
            week.w * 1000,
            week[metric === 'additions'
              ? 'a'
              : metric === 'deletions'
                ? 'd'
                : 'c'],
          ]),
      })),
    credits: {
      enabled: false,
    },
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={onBack}
        sx={{ mb: 3 }}
      >
        Back to repositories
      </Button>

      <Typography variant="h4" fontWeight="bold" gutterBottom>
        {repository.full_name}
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 3 }}>
        {repository.description || 'No description provided.'}
      </Typography>

      <FormControl size="small" sx={{ minWidth: 180, mb: 3 }}>
        <InputLabel id="metric-label">Activity metric</InputLabel>

        <Select
          labelId="metric-label"
          value={metric}
          label="Activity metric"
          onChange={event => setMetric(event.target.value)}
        >
          <MenuItem value="additions">Additions</MenuItem>
          <MenuItem value="deletions">Deletions</MenuItem>
          <MenuItem value="commits">Commits</MenuItem>
        </Select>
      </FormControl>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>
            Loading repository activity...
          </Typography>
        </Box>
      )}

      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            '& > div': {
              bgcolor: 'white',
              p: { xs: 1, sm: 3 },
              borderRadius: 3,
              border: '1px solid #e0e0e0',
              minWidth: 0,
            },
          }}
        >
          <Box>
            <HighchartsReact
              highcharts={Highcharts}
              options={totalOptions}
            />
          </Box>

          <Box>
            <HighchartsReact
              highcharts={Highcharts}
              options={contributorOptions}
            />
          </Box>

          {activity.contributors.length === 0 && (
            <Alert severity="info">
              GitHub has no contributor statistics available for this
              repository yet.
            </Alert>
          )}
        </Box>
      )}
    </Container>
  )
}

export default RepositoryDetails