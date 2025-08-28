import { GetStaticProps, InferGetStaticPropsType } from 'next'
import { createSwaggerSpec } from 'next-swagger-doc'
import { useState } from 'react'

function ApiDoc({ spec }: InferGetStaticPropsType<typeof getStaticProps>) {
  const [activeTab, setActiveTab] = useState('overview')
  
  const endpoints = [
    { 
      method: 'POST', 
      path: '/api/signup', 
      desc: 'Register new user', 
      auth: false,
      requestBody: {
        email: "client@test.com",
        password: "password123",
        firstName: "John",
        lastName: "Doe",
        type: "CLIENT"
      },
      response: {
        message: "User created successfully",
        user: { id: "...", email: "client@test.com", firstName: "John" },
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
      }
    },
    { 
      method: 'POST', 
      path: '/api/login', 
      desc: 'User authentication', 
      auth: false,
      requestBody: {
        email: "client@test.com",
        password: "password123"
      },
      response: {
        message: "Login successful",
        user: { id: "...", email: "client@test.com" },
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
      }
    },
    { 
      method: 'GET', 
      path: '/api/me', 
      desc: 'Get current user profile', 
      auth: true,
      response: {
        user: {
          id: "...",
          email: "client@test.com",
          firstName: "John",
          lastName: "Doe",
          type: "CLIENT"
        }
      }
    },
    { 
      method: 'GET', 
      path: '/api/services', 
      desc: 'List all services', 
      auth: false,
      response: {
        services: [
          {
            id: "...",
            name: "House Cleaning",
            description: "Professional house cleaning service",
            category: "Cleaning",
            basePrice: 50.00
          }
        ]
      }
    },
    { 
      method: 'POST', 
      path: '/api/services', 
      desc: 'Create service (Admin only)', 
      auth: true,
      requestBody: {
        name: "Plumbing",
        description: "Professional plumbing services",
        category: "Maintenance",
        basePrice: 75.00
      }
    },
    { 
      method: 'POST', 
      path: '/api/bookings', 
      desc: 'Create booking', 
      auth: true,
      requestBody: {
        serviceId: "service_id_here",
        scheduledAt: "2025-08-27T10:00:00Z",
        notes: "Please bring cleaning supplies"
      }
    },
    { 
      method: 'GET', 
      path: '/api/bookings', 
      desc: 'Get user bookings', 
      auth: true,
      response: {
        bookings: [
          {
            id: "...",
            status: "PENDING",
            scheduledAt: "2025-08-27T10:00:00Z",
            service: { name: "House Cleaning" }
          }
        ]
      }
    },
    { 
      method: 'PATCH', 
      path: '/api/bookings/:id', 
      desc: 'Accept/reject booking', 
      auth: true,
      requestBody: {
        status: "ACCEPTED"
      }
    },
    { 
      method: 'POST', 
      path: '/api/reviews', 
      desc: 'Create service review', 
      auth: true,
      requestBody: {
        bookingId: "booking_id_here",
        rating: 5,
        comment: "Excellent service!"
      }
    },
  ]

  function EndpointCard({ endpoint }: { endpoint: any }) {
    const [isExpanded, setIsExpanded] = useState(false)
    
    return (
      <div style={{ 
        border: '1px solid #e5e7eb', 
        borderRadius: '8px', 
        background: '#ffffff',
        overflow: 'hidden'
      }}>
        <div 
          style={{ 
            padding: '16px',
            cursor: 'pointer',
            borderBottom: isExpanded ? '1px solid #e5e7eb' : 'none'
          }}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <span style={{ 
              background: endpoint.method === 'GET' ? '#10b981' : endpoint.method === 'POST' ? '#3b82f6' : '#f59e0b',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: '600',
              minWidth: '60px',
              textAlign: 'center'
            }}>
              {endpoint.method}
            </span>
            <code style={{ fontWeight: '600', color: '#1f2937' }}>{endpoint.path}</code>
            {endpoint.auth && (
              <span style={{ 
                background: '#fef3c7', 
                color: '#92400e', 
                padding: '2px 6px', 
                borderRadius: '4px', 
                fontSize: '11px',
                fontWeight: '500'
              }}>
                🔒 Auth Required
              </span>
            )}
            <span style={{ marginLeft: 'auto', color: '#6b7280' }}>
              {isExpanded ? '▲' : '▼'}
            </span>
          </div>
          <p style={{ color: '#6b7280', margin: 0 }}>{endpoint.desc}</p>
        </div>
        
        {isExpanded && (
          <div style={{ padding: '16px', background: '#f8fafc' }}>
            {endpoint.auth && (
              <div style={{ marginBottom: '16px', padding: '12px', background: '#fef3c7', borderRadius: '6px' }}>
                <strong>Authorization Required:</strong>
                <code style={{ display: 'block', marginTop: '4px', background: '#f3f4f6', padding: '8px', borderRadius: '4px' }}>
                  Authorization: Bearer YOUR_JWT_TOKEN
                </code>
              </div>
            )}
            
            {endpoint.requestBody && (
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ margin: '0 0 8px 0', color: '#374151' }}>Request Body:</h4>
                <pre style={{ 
                  background: '#1f2937', 
                  color: '#e5e7eb', 
                  padding: '12px', 
                  borderRadius: '6px',
                  fontSize: '14px',
                  overflow: 'auto'
                }}>
                  {JSON.stringify(endpoint.requestBody, null, 2)}
                </pre>
              </div>
            )}
            
            {endpoint.response && (
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ margin: '0 0 8px 0', color: '#374151' }}>Response:</h4>
                <pre style={{ 
                  background: '#065f46', 
                  color: '#d1fae5', 
                  padding: '12px', 
                  borderRadius: '6px',
                  fontSize: '14px',
                  overflow: 'auto'
                }}>
                  {JSON.stringify(endpoint.response, null, 2)}
                </pre>
              </div>
            )}
            
            <div>
              <h4 style={{ margin: '0 0 8px 0', color: '#374151' }}>Try it with cURL:</h4>
              <pre style={{ 
                background: '#1e293b', 
                color: '#e2e8f0', 
                padding: '12px', 
                borderRadius: '6px',
                fontSize: '12px',
                overflow: 'auto'
              }}>
{`curl -X ${endpoint.method} http://localhost:3000${endpoint.path} \\${endpoint.auth ? '\n  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\' : ''}${endpoint.requestBody ? '\n  -H "Content-Type: application/json" \\\n  -d \'' + JSON.stringify(endpoint.requestBody, null, 2) + '\'' : ''}`}
              </pre>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <header style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h1 style={{ color: '#2563eb', marginBottom: '8px' }}>Help App API Documentation</h1>
        <p style={{ color: '#64748b', fontSize: '18px' }}>Backend API for connecting clients with service providers</p>
        <div style={{ background: '#f1f5f9', padding: '12px', borderRadius: '8px', marginTop: '20px' }}>
          <strong>Base URL:</strong> <code style={{ background: '#e2e8f0', padding: '4px 8px', borderRadius: '4px' }}>
            http://localhost:3000
          </code>
        </div>
      </header>

      <nav style={{ marginBottom: '30px', borderBottom: '2px solid #e5e7eb' }}>
        <div style={{ display: 'flex', gap: '20px' }}>
          {['overview', 'endpoints', 'auth', 'spec'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '12px 0',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab ? '2px solid #2563eb' : '2px solid transparent',
                color: activeTab === tab ? '#2563eb' : '#64748b',
                fontWeight: activeTab === tab ? '600' : '400',
                textTransform: 'capitalize',
                cursor: 'pointer'
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </nav>

      {activeTab === 'overview' && (
        <div>
          <h2>Quick Start</h2>
          <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
            <h3>1. Register a user</h3>
            <pre style={{ background: '#1e293b', color: '#e2e8f0', padding: '16px', borderRadius: '6px', overflow: 'auto' }}>
{`curl -X POST http://localhost:3000/api/signup \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "client@test.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "type": "CLIENT"
  }'`}
            </pre>
            
            <h3>2. Login and get token</h3>
            <pre style={{ background: '#1e293b', color: '#e2e8f0', padding: '16px', borderRadius: '6px', overflow: 'auto' }}>
{`curl -X POST http://localhost:3000/api/login \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "client@test.com",
    "password": "password123"
  }'`}
            </pre>
            
            <h3>3. Use token for protected routes</h3>
            <pre style={{ background: '#1e293b', color: '#e2e8f0', padding: '16px', borderRadius: '6px', overflow: 'auto' }}>
{`curl -X GET http://localhost:3000/api/me \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN"`}
            </pre>
          </div>
        </div>
      )}

      {activeTab === 'endpoints' && (
        <div>
          <h2>API Endpoints</h2>
          <div style={{ display: 'grid', gap: '16px' }}>
            {endpoints.map((endpoint, index) => (
              <EndpointCard key={index} endpoint={endpoint} />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'auth' && (
        <div>
          <h2>Authentication</h2>
          <div style={{ background: '#fef9e7', border: '1px solid #f3e68a', borderRadius: '8px', padding: '20px', marginBottom: '20px' }}>
            <h3 style={{ color: '#92400e', marginTop: 0 }}>🔐 JWT Authentication</h3>
            <p>Protected endpoints require a Bearer token in the Authorization header:</p>
            <code style={{ background: '#f3f4f6', padding: '12px', display: 'block', borderRadius: '6px' }}>
              Authorization: Bearer &lt;your-jwt-token&gt;
            </code>
          </div>
          
          <h3>User Types</h3>
          <ul>
            <li><strong>CLIENT:</strong> Can create bookings and reviews</li>
            <li><strong>PROVIDER:</strong> Can accept/reject bookings</li>
            <li><strong>ADMIN:</strong> Can create services (set isAdmin: true)</li>
          </ul>
          
          <h3>Response Codes</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '12px' }}>
            <code style={{ background: '#dcfce7', padding: '4px 8px', borderRadius: '4px' }}>200</code>
            <span>Success</span>
            <code style={{ background: '#dcfce7', padding: '4px 8px', borderRadius: '4px' }}>201</code>
            <span>Created</span>
            <code style={{ background: '#fef3c7', padding: '4px 8px', borderRadius: '4px' }}>400</code>
            <span>Bad Request</span>
            <code style={{ background: '#fee2e2', padding: '4px 8px', borderRadius: '4px' }}>401</code>
            <span>Unauthorized</span>
            <code style={{ background: '#fee2e2', padding: '4px 8px', borderRadius: '4px' }}>403</code>
            <span>Forbidden</span>
            <code style={{ background: '#fee2e2', padding: '4px 8px', borderRadius: '4px' }}>404</code>
            <span>Not Found</span>
          </div>
        </div>
      )}

      {activeTab === 'spec' && (
        <div>
          <h2>OpenAPI Specification</h2>
          <div style={{ marginBottom: '20px' }}>
            <p>Copy this specification and paste it into <a href="https://editor.swagger.io/" target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb' }}>Swagger Editor</a> for interactive documentation.</p>
            <button
              onClick={() => navigator.clipboard.writeText(JSON.stringify(spec, null, 2))}
              style={{
                background: '#2563eb',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                marginBottom: '16px'
              }}
            >
              📋 Copy to Clipboard
            </button>
          </div>
          <pre style={{ 
            background: '#f8fafc', 
            padding: '20px', 
            borderRadius: '8px',
            overflow: 'auto',
            maxHeight: '600px',
            border: '1px solid #e5e7eb',
            fontSize: '14px'
          }}>
            {JSON.stringify(spec, null, 2)}
          </pre>
        </div>
      )}

      <footer style={{ marginTop: '40px', padding: '20px', textAlign: 'center', color: '#64748b', borderTop: '1px solid #e5e7eb' }}>
        <p>Help App API v1.0.0 | Built with Next.js, Prisma & PostgreSQL</p>
      </footer>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
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
            bearerFormat: 'JWT',
            description: 'Enter your JWT token'
          }
        }
      }
    }
  })

  return {
    props: {
      spec,
    },
  }
}

export default ApiDoc