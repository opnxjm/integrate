import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import { CommentContextProvider } from './share/context/CommentContext';


const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <CommentContextProvider>
    <QueryClientProvider client={queryClient}>
    <App />
    </QueryClientProvider>
    </CommentContextProvider>
  </React.StrictMode>
);
