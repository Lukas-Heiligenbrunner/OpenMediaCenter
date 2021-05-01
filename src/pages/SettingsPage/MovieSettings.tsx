import React from 'react';
import style from './MovieSettings.module.css';
import {APINode, callAPI} from '../../utils/Api';
import {GeneralSuccess} from '../../types/GeneralTypes';

interface state {
    text: string[];
    startbtnDisabled: boolean;
}

interface Props {}

interface MessageBase {
    Action: string;
}

interface TextMessage extends MessageBase {
    Message: string;
}

interface ReindexEvent extends MessageBase {
    Event: string;
}

/**
 * Component for MovieSettings on Settingspage
 * handles settings concerning to movies in general
 */
class MovieSettings extends React.Component<Props, state> {
    constructor(props: Props) {
        super(props);

        this.state = {
            text: [],
            startbtnDisabled: false
        };
    }

    componentDidMount(): void {
        // expectingMessage is set to true
        this.dial();
    }

    dial(): void {
        console.log('trying to connect...');
        const conn = new WebSocket(`ws://${window.location.host}/subscribe`);
        conn.addEventListener('close', (ev) => {
            this.appendLog(`WebSocket Disconnected code: ${ev.code}, reason: ${ev.reason}`, true);
            if (ev.code !== 1001) {
                this.appendLog('Reconnecting in 1s', true);
                setTimeout((): void => this.dial(), 1000);
            }
        });
        conn.addEventListener('open', (_ev) => {
            console.info('websocket connected');
        });

        // This is where we handle messages received.
        conn.addEventListener('message', (ev) => {
            if (typeof ev.data !== 'string') {
                console.error('unexpected message type', typeof ev.data);
                return;
            }
            this.handleMessage(ev.data);
        });
    }

    handleMessage(message: string): void {
        const obj: MessageBase = JSON.parse(message);

        if (obj.Action === 'message') {
            const msg = obj as TextMessage;
            this.appendLog(msg.Message);
        } else if (obj.Action === 'reindexAction') {
            const msg = obj as ReindexEvent;
            if (msg.Event === 'start') {
                this.setState({startbtnDisabled: true});
            } else if (msg.Event === 'stop') {
                this.setState({startbtnDisabled: false});
            }
        } else {
            console.error('unexpected response from server: ' + message);
        }
    }

    // appendLog appends the passed text to messageLog.
    appendLog(text: string, error?: boolean): void {
        this.setState({
            // insert a string for each line
            text: [text, ...this.state.text]
        });

        if (error) {
            console.log('heyy err');
        }
    }

    render(): JSX.Element {
        return (
            <>
                <button
                    disabled={this.state.startbtnDisabled}
                    className='btn btn-success'
                    onClick={(): void => {
                        this.startReindex();
                    }}>
                    Reindex Movie
                </button>
                <button
                    className='btn btn-warning'
                    onClick={(): void => {
                        this.startTVShowReindex();
                    }}>
                    TVShow Reindex
                </button>
                <div className={style.indextextarea}>
                    {this.state.text.map((m) => (
                        <div key={m} className='textarea-element'>
                            {m}
                        </div>
                    ))}
                </div>
            </>
        );
    }

    /**
     * starts the reindex process of the videos in the specified folder
     */
    startReindex(): void {
        this.setState({text: []});
        // clear output text before start
        callAPI(APINode.Settings, {action: 'startReindex'}, (result: GeneralSuccess): void => {
            if (result.result === 'success') {
                console.log('started successfully');
            }
        });
    }

    /**
     * send request to cleanup db gravity
     */
    cleanupGravity(): void {
        callAPI(APINode.Settings, {action: 'cleanupGravity'}, () => {
            this.setState({
                text: ['successfully cleaned up gravity!']
            });
        });
    }

    private startTVShowReindex(): void {
        this.setState({text: []});
        callAPI(APINode.Settings, {action: 'startTVShowReindex'}, (result: GeneralSuccess): void => {
            if (result.result === 'success') {
                console.log('started successfully');
            }
        });
    }
}

export default MovieSettings;
