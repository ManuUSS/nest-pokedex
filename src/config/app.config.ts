

export const EnvConfiguration = () => ({
  environment: process.env.NODE_ENV || 'development',
  mongodb: process.env.MONGO_DB,
  port: parseInt( process.env.PORT! ),
  defaultLimit: parseInt( process.env.DEFAULT_LIMIT! ),
})

