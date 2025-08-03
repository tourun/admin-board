import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import Modal from 'react-modal';
import router from './routes/index.jsx';
import './App.css';

function App() {
  useEffect(() => {
    // 配置react-modal的应用根元素
    Modal.setAppElement('#root');
  }, []);

  return (
    <div className="app">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
