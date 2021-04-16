import React from 'react';
import Preview from '../../elements/Preview/Preview';

class TVShowPage extends React.Component {
    render(): JSX.Element {
        return (
            <>
                <Preview name='myTestItem' picLoader={(callback): void => callback('')} />
            </>
        );
    }
}

export default TVShowPage;
