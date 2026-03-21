import * as realAuth from './auth'
import * as mockAuth from './mock/auth'
import * as realUser from './user'
import * as mockUser from './mock/user'
import * as realReports from './reports'
import * as mockReports from './mock/reports'
import * as realShare from './share'
import * as mockShare from './mock/share'

const isDummy = import.meta.env.VITE_DUMMY_APIS === 'true'

export const api = {
  auth: isDummy ? mockAuth : realAuth,
  user: isDummy ? mockUser : realUser,
  reports: isDummy ? mockReports : realReports,
  share: isDummy ? mockShare : realShare,
}
