import React from 'react';
import {APINode, callAPI} from '../utils/Api';

interface Props<T> {
    onLoad?: JSX.Element;
    render: (data: T, actions: {refresh: () => void}) => JSX.Element;
    node: APINode;
    action: string;
    params?: {[_: string]: string | number | boolean | object};
}

interface State {
    loaded: boolean;
}

export default class APIComponent<T> extends React.Component<Props<T>, State> {
    state = {
        loaded: false
    };

    data: T | undefined;

    render(): JSX.Element {
        if (this.state.loaded && this.data !== undefined) {
            return this.props.render(this.data, {refresh: () => this.loadData()});
        } else {
            return this.props.onLoad ? this.props.onLoad : <></>;
        }
    }

    componentDidMount(): void {
        this.loadData();
    }

    componentDidUpdate(prevProps: Readonly<Props<T>>): void {
        if (prevProps.params !== this.props.params) {
            this.loadData();
        }
    }

    private loadData(): void {
        this.setState({loaded: false});
        callAPI(this.props.node, {action: this.props.action, ...this.props.params}, (result: T) => {
            this.data = result;
            this.setState({loaded: true});
        });
    }
}
