

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Help App Backend API</h1>
        
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Authentication</h2>
            <ul className="space-y-2">
              <li><code className="bg-gray-100 p-1 rounded">POST /api/signup</code> - Register new user</li>
              <li><code className="bg-gray-100 p-1 rounded">POST /api/login</code> - User login</li>
              <li><code className="bg-gray-100 p-1 rounded">GET /api/me</code> - Get user profile</li>
            </ul>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-4">Services</h2>
            <ul className="space-y-2">
              <li><code className="bg-gray-100 p-1 rounded">GET /api/services</code> - List services</li>
              <li><code className="bg-gray-100 p-1 rounded">POST /api/services</code> - Create service</li>
              <li><code className="bg-gray-100 p-1 rounded">GET /api/services/[id]</code> - Get service</li>
            </ul>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-4">Bookings</h2>
            <ul className="space-y-2">
              <li><code className="bg-gray-100 p-1 rounded">GET /api/bookings</code> - List bookings</li>
              <li><code className="bg-gray-100 p-1 rounded">POST /api/bookings</code> - Create booking</li>
              <li><code className="bg-gray-100 p-1 rounded">GET /api/bookings/[id]</code> - Get booking</li>
            </ul>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
            <ul className="space-y-2">
              <li><code className="bg-gray-100 p-1 rounded">GET /api/reviews</code> - List reviews</li>
              <li><code className="bg-gray-100 p-1 rounded">POST /api/reviews</code> - Create review</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
