import React from "react";
import ReactDom from 'react-dom'
import Tag from './Tag'
import {render} from '@testing-library/react'
import "@testing-library/jest-dom"

it('renders without crashing ', function () {
    const div = document.createElement("div");
    ReactDom.render(<Tag/>,div);
    ReactDom.unmountComponentAtNode(div);
});

it('renders childs correctly', function () {
    const {getByTestId} = render(<Tag>test</Tag>);
    expect(getByTestId("Test-Tag")).toHaveTextContent("test");
});
