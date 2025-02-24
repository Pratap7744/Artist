import { useState } from 'react'
import './App.css'
import BeautyAndEmbroideryWebsite from './artistPage'
function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <BeautyAndEmbroideryWebsite/>
    </div>
  )
}

export default App
