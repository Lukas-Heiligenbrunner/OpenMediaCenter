// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';

import {configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import GlobalInfos from './utils/GlobalInfos';

configure({adapter: new Adapter()});

/**
 * prepares fetch api for a virtual test call
 * @param response the response fetch should give you back
 * @returns {jest.Mock<any, any>} a jest mock function simulating a fetch
 */
global.prepareFetchApi = (response) => {
    const mockJsonPromise = Promise.resolve(response);
    const mockFetchPromise = Promise.resolve({
        json: () => mockJsonPromise,
        text: () => mockJsonPromise
    });
    return (jest.fn().mockImplementation(() => mockFetchPromise));
};

/**
 * prepares a failing virtual fetch api call
 * @returns {jest.Mock<any, any>} a jest moch function simulating a failing fetch call
 */
global.prepareFailingFetchApi = () => {
    const mockFetchPromise = Promise.reject('myreason');
    return (jest.fn().mockImplementation(() => mockFetchPromise));
};

/**
 * prepares a viewbinding instance
 * @param func a mock function to be called
 */
global.prepareViewBinding = (func) => {
    GlobalInfos.getViewBinding = () => {
        return {
            changeRootElement: func,
            returnToLastElement: func
        };
    };
};

global.callAPIMock = (resonse) => {
    const helpers = require('./utils/Api');
    helpers.callAPI = jest.fn().mockImplementation((_, __, func1) => {func1(resonse);});
};

// code to run before each test
global.beforeEach(() => {
    // empty fetch response implementation for each test
    global.fetch = prepareFetchApi({});
    // todo with callAPIMock
});

global.afterEach(() => {
    // clear all mocks after each test
    jest.resetAllMocks();
});

