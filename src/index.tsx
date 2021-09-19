import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {BrowserRouter} from 'react-router-dom';

// don't allow console logs within production env
global.console.log = process.env.NODE_ENV !== 'development' ? (_: string | number | boolean): void => {} : global.console.log;

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root')
);
