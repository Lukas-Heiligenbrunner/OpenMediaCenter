import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// don't allow console logs within production env
global.console.log = process.env.NODE_ENV !== 'development' ? (s: string | number | boolean): void => {} : global.console.log;

ReactDOM.render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>,
    document.getElementById('root')
);
