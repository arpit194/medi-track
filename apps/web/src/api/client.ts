import axios from 'axios'

export const TOKEN_KEY = 'mt_access_token'

export const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // send refresh token cookie on every request
})

client.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

let isRefreshing = false
type QueueEntry = { resolve: (token: string) => void; reject: (err: unknown) => void }
let refreshQueue: QueueEntry[] = []

function drainQueue(token: string) {
  refreshQueue.forEach(({ resolve }) => resolve(token))
  refreshQueue = []
}

function rejectQueue(err: unknown) {
  refreshQueue.forEach(({ reject }) => reject(err))
  refreshQueue = []
}

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!axios.isAxiosError(error) || error.response?.status !== 401 || !error.config) {
      return Promise.reject(error)
    }

    const original = error.config

    // Don't retry refresh/logout calls to avoid infinite loops
    if ((original as unknown as Record<string, unknown>)['_retry'] || original.url?.includes('/auth/')) {
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshQueue.push({
          resolve: (token) => {
            original.headers.Authorization = `Bearer ${token}`
            resolve(client(original))
          },
          reject,
        })
      })
    }

    ;(original as unknown as Record<string, unknown>)['_retry'] = true
    isRefreshing = true

    try {
      const { data } = await client.post<{ token: string }>('/auth/refresh')
      const newToken = data.token
      localStorage.setItem(TOKEN_KEY, newToken)
      drainQueue(newToken)
      original.headers.Authorization = `Bearer ${newToken}`
      return client(original)
    } catch (refreshError) {
      rejectQueue(refreshError)
      localStorage.removeItem(TOKEN_KEY)
      window.location.href = '/login'
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  },
)

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message ?? error.message
  }
  if (error instanceof Error) return error.message
  return 'Something went wrong. Please try again.'
}
