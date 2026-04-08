import { ReactElement } from 'react';

import tileStyles from '../Tile/tile.module.scss';

type Props = {
    value: string;
};

const BoardAxisLabel = ({ value }: Props): ReactElement => {
    return (
        <div
            className={`${tileStyles.tile} ${tileStyles.coords} d-none d-sm-block`}
        >
            <div className={tileStyles.tileInside}>
                <div className={tileStyles.front}>
                    <span className={tileStyles.coords}>{value}</span>
                </div>
                <div className={tileStyles.back}>
                    <span className={tileStyles.coords}>{value}</span>
                </div>
            </div>
        </div>
    );
};

export default BoardAxisLabel;
