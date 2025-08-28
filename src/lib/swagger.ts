import { createSwaggerSpec } from 'next-swagger-doc'

export const getApiDocs = async () => {
  const spec = createSwaggerSpec({
    apiFolder: 'pages/api',
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Help App API',
        version: '1.0.0',
        description: 'Backend API for Help App - connecting clients with service providers'
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Development server'
        }
      ],
      components: {
        securitySchemes: {
          BearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
          }
        }
      },
      security: [{ BearerAuth: [] }]
    }
  })
  return spec
}