import './index.css'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import Result from './Pages/Result'
import Home from './Pages/Home'
import NoPage from './Pages/NoPage'


function App() {

  return (
    <Router>
      <>
        {/* <div className='site-content flex flex-col justify-center items-center'>
          <Link to={''}><h1 className='max-w-md scroll-m-20 pt-5 pb-5 text-3xl font-semibold tracking-tight first:mt-0'>Home</h1></Link>
        </div> */}

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
