import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { GitHubProvider } from './context/GitHubContext.jsx'
import RepositoryDetails from './pages/RepositoryDetails.jsx'
import { LogsProvider } from './context/LogsContext.jsx'
import LogsPanel from './LogsPanel.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <LogsProvider>
        <LogsPanel />
        <GitHubProvider>
          <Routes>
            <Route path="/" element={<App />} />
            <Route
              path="/repos/:owner/:repositoryName"
              element={<RepositoryDetails />}
            />
          </Routes>
        </GitHubProvider>
      </LogsProvider>
    </HashRouter>
  </StrictMode>,
)
