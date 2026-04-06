// TODO: remove the disables
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

import React, { ReactElement, MouseEvent } from 'react';

import styles from './tile.scss';

import { numToAlpha } from 'utils/helpers';

type Props = {
    type: number;
    coords: [number, number] | [number];
    size: number | string;
    onMoveClick?: (event: MouseEvent<HTMLElement>) => void;
    isDisabled: boolean;
};

const Tile = ({
    type,
    coords,
    size,
    onMoveClick,
    isDisabled,
}: Props): ReactElement => {
    const typeClass = ((): string => {
        switch (type) {
            case 0:
                return styles.flipped;
            case 2:
                return styles.inactive;
            case 3:
            case 4:
                return `${styles.coords} d-none d-sm-block`;
            case 1:
            default:
                return styles.active;
        }
    })();
    const numSize = typeof size === 'number' ? size : parseInt(size, 10);
    const alphanumericCoords = numToAlpha(coords, numSize, type);
    return (
        <div
            className={`${styles.tile} ${
                isDisabled ? styles.disabled : ''
            } ${typeClass}`}
        >
            <div className={styles.tileInside}>
                <div
                    className={styles.front}
                    data-coords={alphanumericCoords}
                    onClick={onMoveClick}
                >
                    <span className={`${styles.coords} d-none d-sm-block`}>
                        {alphanumericCoords}
                    </span>
                </div>
                <div
                    className={styles.back}
                    data-coords={alphanumericCoords}
                    onClick={onMoveClick}
                >
                    <span className={`${styles.coords} d-none d-sm-block`}>
                        {alphanumericCoords}
                    </span>
                </div>
            </div>
        </div>
    );
};

Tile.defaultProps = {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onMoveClick: () => {},
};

export default Tile;
