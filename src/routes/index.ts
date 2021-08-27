import { Router } from 'express'
import { userRoutes } from '@auth/routes'
import { organizationRoutes } from '@organization/routes'
import { taskRoutes } from '@tasks/routes'

const baseRouter = Router()

baseRouter.use('/v1/users', userRoutes)
baseRouter.use('/v1/tasks', taskRoutes)
baseRouter.use('/v1/organizations', organizationRoutes)

export default baseRouter
