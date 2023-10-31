import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { MessageContextProvider } from './MessageContext'
import { UserContextProvider } from './UserContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <UserContextProvider>
    <MessageContextProvider>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </MessageContextProvider>
  </UserContextProvider>,
)
