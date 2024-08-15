import './index.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Result from './Pages/Result'
import Home from './Pages/Home'
import NoPage from './Pages/NoPage'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createContext, Dispatch, SetStateAction, useState } from 'react'

const queryClient = new QueryClient();

type QueryContextType = [string | null, Dispatch<SetStateAction<string | null>>];
export const Context = createContext<QueryContextType | undefined>(undefined);

function App() {
  const [query, setQuery] = useState<string | null>('');

  return (
    <Router>
      <Context.Provider value={[query, setQuery]}>
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
      </Context.Provider>
    </Router>
  )
}

export default App