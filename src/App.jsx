import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
Alert,
Box,
Button,
CircularProgress,
Container,
Typography,
} from '@mui/material'

import Header from './components/Header'
import DateFilter from './components/DateFilter'
import RepositoryCard from './components/RepositoryCard'
import RepositoryDetails from './components/RepositoryDetails'

import {
fetchRepositoriesRequest,
setSelectedPeriod,
} from './redux/repositorySlice'

const App = () => {
const dispatch = useDispatch()

const [selectedRepository, setSelectedRepository] = useState(null)

const {
items,
loading,
error,
page,
hasMore,
selectedPeriod,
} = useSelector(state => state.repositories)

useEffect(() => {
dispatch(
fetchRepositoriesRequest({
page: 1,
days: selectedPeriod,
}),
)
}, [dispatch, selectedPeriod])

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

if (selectedRepository) {
return (
<> <Header />

```
    <RepositoryDetails
      repository={selectedRepository}
      onBack={() => setSelectedRepository(null)}
    />
  </>
)

}

return (
<> <Header />

  <Container maxWidth="md" sx={{ py: 4 }}>
    <Box sx={{ mb: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Explore Trending Repositories
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Discover recently created GitHub repositories with the most stars.
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
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    )}

    {!loading && !error && items.length === 0 && (
      <Typography textAlign="center" sx={{ py: 4 }}>
        No repositories found for this period.
      </Typography>
    )}

    {!loading && hasMore && items.length > 0 && (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Button variant="contained" onClick={handleLoadMore}>
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
</>

)
}

export default App