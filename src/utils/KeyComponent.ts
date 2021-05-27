import * as React from 'react';

abstract class KeyComponent<P = {}, S = {}> extends React.Component<P, S> {
    constructor(props: P) {
        super(props);

        this.handler = this.handler.bind(this);
    }

    componentDidMount(): void {
        document.addEventListener('keyup', this.handler);
    }

    componentWillUnmount(): void {
        document.removeEventListener('keyup', this.handler);
    }

    private handler(e: KeyboardEvent): void {
        this.keyHandler(e.key);
    }

    abstract keyHandler(key: string): void;
}

export default KeyComponent;
