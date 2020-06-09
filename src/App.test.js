import React from 'react';
import { render } from '@testing-library/react';
import App from './App';
import ReactDom from "react-dom";

describe('<App/>', function () {
  it('renders without crashing ', function () {
    const div = document.createElement("div");
    ReactDom.render(<App/>,div);
    ReactDom.unmountComponentAtNode(div);
  });

  it('renders title', () => {
    const { getByText } = render(<App />);
    const linkElement = getByText(/Home Page/i);
    expect(linkElement).toBeInTheDocument();
  });

  it('are navlinks correct', function () {
    const { getByText } = render(<App />);
    const randomElement = getByText(/Random Video/i);
    const categoryElement = getByText(/Categories/i);
    const settingsElement = getByText(/Settings/i);
    expect(randomElement).toBeInTheDocument();
    expect(categoryElement).toBeInTheDocument();
    expect(settingsElement).toBeInTheDocument();
  });
});
