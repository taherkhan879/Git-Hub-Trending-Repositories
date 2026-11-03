import { takeLatest, call, put } from 'redux-saga/effects'

import {
  fetchRepositoriesRequest,
  fetchRepositoriesSuccess,
  fetchRepositoriesFailure,
} from './repositorySlice'

function* fetchRepositoriesWorker(action) {
  try {
    const { page = 1, days = 7 } = action.payload || {}

    const date = new Date()
    date.setDate(date.getDate() - days)

    const formattedDate = date.toISOString().split('T')[0]

    const url =
      `https://api.github.com/search/repositories` +
      `?q=created:>${formattedDate}` +
      `&sort=stars&order=desc&page=${page}&per_page=20`

    const response = yield call(fetch, url)

    if (!response.ok) {
      throw new Error('Failed to fetch repositories from GitHub')
    }

    const data = yield call([response, 'json'])

    yield put(
      fetchRepositoriesSuccess({
        items: data.items || [],
        page,
        hasMore: page * 20 < Math.min(data.total_count || 0, 1000),
      }),
    )
  } catch (error) {
    yield put(fetchRepositoriesFailure(error.message))
  }
}

export default function* repositorySaga() {
  yield takeLatest(fetchRepositoriesRequest.type, fetchRepositoriesWorker)
}