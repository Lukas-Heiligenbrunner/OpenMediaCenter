import React from "react";
import ReactDom from 'react-dom'
import SideBar from "./SideBar";

import {render} from '@testing-library/react'
import "@testing-library/jest-dom"

describe('<SideBar/>', function () {
    it('renders without crashing ', function () {
        const div = document.createElement("div");
        ReactDom.render(<SideBar/>,div);
        ReactDom.unmountComponentAtNode(div);
    });

    it('renders childs correctly', function () {
        const {getByText} = render(<SideBar>test</SideBar>);
        const randomElement = getByText(/test/i);
        expect(randomElement).toBeInTheDocument();
    });
});
