import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log("DJ Auto Fleet: Initializing Application...");

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("DJ Auto Fleet: Target container #root not found.");
} else {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log("DJ Auto Fleet: Rendered successfully.");
}