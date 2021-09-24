import style from './DropZone.module.css';
import React, {useState} from 'react';
import {cookie} from '../../utils/context/Cookie';
import GlobalInfos from '../../utils/GlobalInfos';

export const DropZone = (): JSX.Element => {
    const [ondrag, setDrag] = useState(0);
    const [percent, setpercent] = useState(0.0);

    const theme = GlobalInfos.getThemeStyle();

    const uploadFile = (f: FileList): void => {
        const xhr = new XMLHttpRequest(); // create XMLHttpRequest
        const data = new FormData(); // create formData object

        for (let i = 0; i < f.length; i++) {
            const file = f.item(i);
            if (file) {
                data.append('file' + i, file);
            }
        }

        xhr.onload = function (): void {
            console.log(this.responseText); // whatever the server returns

            setpercent(0);
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
        <div
            className={style.dropArea + (ondrag > 0 ? ' ' + style.highlight : '') + ' ' + theme.secbackground}
            onDragEnter={(e): void => {
                e.preventDefault();
                e.stopPropagation();
                setDrag(ondrag + 1);
            }}
            onDragLeave={(e): void => {
                e.preventDefault();
                e.stopPropagation();
                setDrag(ondrag - 1);
            }}
            onDragOver={(e): void => {
                e.stopPropagation();
                e.preventDefault();
            }}
            onDrop={(e): void => {
                setDrag(0);
                e.preventDefault();
                e.stopPropagation();

                uploadFile(e.dataTransfer.files);
            }}
            onClick={(): void => {
                let input = document.createElement('input');
                input.type = 'file';
                input.multiple = true;
                input.onchange = function (): void {
                    if (input.files) {
                        uploadFile(input.files);
                    }
                };
                input.click();
            }}>
            <div className={style.myForm}>
                <p>To upload new Videos darg and drop them here or click to select some...</p>
                <div style={{width: '100%', height: 5, marginTop: 3}}>
                    <div style={{width: percent + '%', backgroundColor: 'green', height: 5}} />
                </div>
            </div>
        </div>
    );
};
