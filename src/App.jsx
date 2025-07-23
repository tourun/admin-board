import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useRoutes } from 'react-router-dom'
import Modal from 'react-modal'
import routes from './routes/index.jsx'
import './App.css'

// 路由组件，使用useRoutes钩子渲染路由配置
const AppRoutes = () => {
  const routeElements = useRoutes(routes)
  return routeElements
}

function App() {
  useEffect(() => {
    // 配置react-modal的应用根元素
    Modal.setAppElement('#root')
  }, [])

  return (
    <BrowserRouter>
      <div className="app">
        <AppRoutes />
      </div>
    </BrowserRouter>
  )
}

export default App
