import React from "react";
import ReactDom from 'react-dom'

import {render, cleanup} from '@testing-library/react'
import "@testing-library/jest-dom"

import AddTagPopup from "./AddTagPopup";

afterEach(cleanup);

describe('<AddTagPopup/>', function () {
    it('renders without crashing ', function () {
        const div = document.createElement("div");
        ReactDom.render(<AddTagPopup/>,div);
        ReactDom.unmountComponentAtNode(div);
    });
});
