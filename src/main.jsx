import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { GitHubProvider } from './context/GitHubContext.jsx'
import RepositoryDetails from './pages/RepositoryDetails.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <GitHubProvider>
        <Routes>
          <Route path="/" element={<App />} />
          <Route
            path="/repos/:owner/:repositoryName"
            element={<RepositoryDetails />}
          />
        </Routes>
      </GitHubProvider>
    </BrowserRouter>
  </StrictMode>,
)