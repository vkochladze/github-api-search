import './index.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Result from './Pages/Result'
import Home from './Pages/Home'
import NoPage from './Pages/NoPage'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient();

function App() {

  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <div className='site-content flex flex-col justify-center items-center'>
          <Routes>
            <Route index element={<Home />} />
            <Route path='/' element={<Home />} />
            <Route path='/result/*' element={<Result />} />
            <Route path='*' element={<NoPage />} />
          </Routes>
        </div>
      </QueryClientProvider>
    </Router>
  )
}

export default App
