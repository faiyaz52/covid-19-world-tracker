import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { register as registerSW } from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'));

// Register service worker for offline functionality and caching
registerSW({
  onSuccess: () => {
    // Content is cached for offline use
  },
  onUpdate: () => {
    // New content is available for next visit
  },
});
