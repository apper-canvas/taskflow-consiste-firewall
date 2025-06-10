import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Layout from './Layout';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <div className="h-screen overflow-hidden bg-gray-50">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/tasks" replace />} />
            <Route path="tasks" element={<Home />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          className="z-[9999]"
          toastClassName="border border-gray-200 shadow-lg"
        />
      </div>
    </BrowserRouter>
  );
}

export default App;