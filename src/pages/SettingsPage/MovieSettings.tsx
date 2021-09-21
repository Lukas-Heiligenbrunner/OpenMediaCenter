import React, {BaseSyntheticEvent, useState} from 'react';
import style from './MovieSettings.module.css';
import {APINode, callAPI} from '../../utils/Api';
import {GeneralSuccess} from '../../types/GeneralTypes';
import {cookie} from '../../utils/context/Cookie';

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
        // check which ws protocol we need
        const wsProt = window.location.protocol === 'http:' ? 'ws' : 'wss';

        const conn = new WebSocket(`${wsProt}://${window.location.host}/subscribe`);
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
                <FileHandler />
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

const FileHandler = (): JSX.Element => {
    const [file, setfile] = useState<File | null>(null);
    const [percent, setpercent] = useState(0.0);

    const uploadFile = (): void => {
        let xhr = new XMLHttpRequest(); // create XMLHttpRequest
        let data = new FormData(); // create formData object
        if (!file) {
            return;
        }
        data.append('file', file);

        xhr.onload = function (): void {
            console.log(this.responseText); // whatever the server returns
        };

        xhr.upload.onprogress = function (e): void {
            console.log(e.loaded / e.total);
            setpercent((e.loaded * 100.0) / e.total);
        };

        xhr.open('post', '/api/video/fileupload'); // open connection
        xhr.setRequestHeader('Accept', 'multipart/form-data');

        const tkn = cookie.Load();
        if (tkn) {
            xhr.setRequestHeader('Token', tkn.Token);
        }

        xhr.send(data); // send data
    };

    return (
        <div style={{backgroundColor: 'white'}}>
            <input
                onChange={(e: BaseSyntheticEvent): void => {
                    console.log(e);
                    if (e.target) {
                        console.log(e.target.files[0]);
                        setfile(e.target.files[0]);
                        // setfile(e.target.files[0]);
                    }
                }}
                type='file'
                name='Select file to upload'
            />
            <button onClick={(): void => uploadFile()}>upload</button>
            <div style={{width: '100%', height: 5, marginTop: 3}}>
                <div style={{width: percent + '%', backgroundColor: 'green', height: 5}} />
            </div>
        </div>
    );
};
