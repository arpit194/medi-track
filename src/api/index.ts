import * as realAuth from './auth'
import * as mockAuth from './mock/auth'

const isDummy = import.meta.env.VITE_DUMMY_APIS === 'true'

export const api = {
  auth: isDummy ? mockAuth : realAuth,
}
