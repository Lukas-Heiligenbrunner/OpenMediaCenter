import React from 'react';

interface Props {
    listenKey: string;
    onKey: () => void;
}

export default class KeyComponent extends React.Component<Props> {
    constructor(props: Props) {
        super(props);

        this.handler = this.handler.bind(this);
    }

    render(): JSX.Element {
        return <>{this.props.children}</>;
    }

    componentDidMount(): void {
        document.addEventListener('keyup', this.handler);
    }

    componentWillUnmount(): void {
        document.removeEventListener('keyup', this.handler);
    }

    private handler(e: KeyboardEvent): void {
        if (e.key === this.props.listenKey) {
            this.props.onKey();
        }
    }
}
