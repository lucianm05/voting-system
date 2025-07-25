/*
|--------------------------------------------------------------------------
| Environment variables service
|--------------------------------------------------------------------------
|
| The `Env.create` method creates an instance of the Env service. The
| service validates the environment variables and also cast values
| to JavaScript data types.
|
*/

import { Env } from '@adonisjs/core/env'

export default await Env.create(new URL('../', import.meta.url), {
  NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
  PORT: Env.schema.number(),
  APP_KEY: Env.schema.string(),
  HOST: Env.schema.string({ format: 'host' }),
  LOG_LEVEL: Env.schema.string(),

  /*
  |----------------------------------------------------------
  | Variables for configuring session package
  |----------------------------------------------------------
  */
  SESSION_DRIVER: Env.schema.enum(['cookie', 'memory'] as const),

  /*
  |----------------------------------------------------------
  | Variables for configuring database connection
  |----------------------------------------------------------
  */
  DB_HOST: Env.schema.string({ format: 'host' }),
  DB_PORT: Env.schema.number(),
  DB_USER: Env.schema.string(),
  DB_PASSWORD: Env.schema.string.optional(),
  DB_DATABASE: Env.schema.string(),

  ADMIN_PASSWORD: Env.schema.string(),
  ADMIN_EMAIL: Env.schema.string(),

  VOTING_ENCRYPTION_SECRET: Env.schema.string(),

  CITIZEN_LAST_VOTES_ENCRYPTION_SECRET: Env.schema.string(),

  DOCUMENTAI_CREDENTIALS: Env.schema.string(),
  DOCUMENTAI_LOCATION: Env.schema.string(),
  DOCUMENTAI_PROJECT_ID: Env.schema.string(),
  DOCUMENTAI_PROCESSOR_ID: Env.schema.string(),
  DOCUMENTAI_VERSION_ID: Env.schema.string(),
})
