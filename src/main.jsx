import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
// 1. ייבוא הכלים של React Query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// 2. יצירת מופע חדש של הקליינט
const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 3. עטיפת האפליקציה ב-Provider */}
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
)