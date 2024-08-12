import './index.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Result from './Pages/Result'
import Home from './Pages/Home'
import NoPage from './Pages/NoPage'


function App() {

  return (
    <Router>
      <>
        <div className='site-content flex flex-col justify-center items-center'>
          <Routes>
            <Route index element={<Home />} />
            <Route path='/' element={<Home />} />
            <Route path='/result/*' element={<Result />} />
            <Route path='*' element={<NoPage />} />
          </Routes>
        </div>
      </>
    </Router>
  )
}

export default App
