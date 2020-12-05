import feathersClient, { makeServicePlugin, BaseModel } from '../../feathers-client.js'
import memory from 'feathers-memory'
import { keyBy } from 'lodash'
import { tasks } from './tasks.fixtures.js'

class Task extends BaseModel {
  constructor(data, options) {
    super(data, options)
  }
  // Required for $FeathersVuex plugin to work after production transpile.
  static modelName = 'Task'
  // Define default properties here
  static instanceDefaults() {
    return {
      email: '',
      password: '',
    }
  }
}
const servicePath = 'tasks'
// Setup feathers-memory, so we don't need a server.
feathersClient.use(
  servicePath,
  memory({
    id: '_id',
    store: keyBy(tasks, '_id'),
    paginate: {
      default: 10,
      max: 100,
    },
    whitelist: ['$regex', '$options'],
  })
)
const servicePlugin = makeServicePlugin({
  Model: Task,
  service: feathersClient.service(servicePath),
  servicePath,
})

// Setup the client-side Feathers hooks.
feathersClient.service(servicePath).hooks({
  before: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
})

export default servicePlugin
