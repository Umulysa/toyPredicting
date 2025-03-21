import React from 'react'
import { BrowserRouter as Router,Route,Routes } from 'react-router-dom'
import Welcome from './pages/welcome'

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" exact element={<Welcome/>}/>
          <Route path="/toys" exact element={<Welcome/>}/>

        </Routes>
      </Router>
    </div>
  )
}

export default App