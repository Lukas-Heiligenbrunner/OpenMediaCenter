import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {BrowserRouter} from 'react-router-dom';
import {FeatureContextProvider} from './utils/context/FeatureContext';

// don't allow console logs within production env
global.console.log = process.env.NODE_ENV !== 'development' ? (_: string | number | boolean): void => {} : global.console.log;

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <FeatureContextProvider>
                <App />
            </FeatureContextProvider>
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root')
);
