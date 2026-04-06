import { ReactElement, MouseEvent } from 'react';

import styles from './tile.module.scss';

import { numToAlpha } from 'utils/helpers';

type Props = {
    type: number;
    coords: [number, number] | [number];
    size: number | string;
    onMoveClick: (event: MouseEvent<HTMLElement>) => void;
    isDisabled: boolean;
};

const Tile = ({
    type,
    coords,
    size,
    onMoveClick,
    isDisabled,
}: Props): ReactElement => {
    const isInteractive = !isDisabled && (type === 0 || type === 1);
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
                {isInteractive ? (
                    <>
                        <button
                            aria-label={`Toggle tile ${alphanumericCoords}`}
                            className={styles.front}
                            data-coords={alphanumericCoords}
                            onClick={onMoveClick}
                            type="button"
                        >
                            <span
                                className={`${styles.coords} d-none d-sm-block`}
                            >
                                {alphanumericCoords}
                            </span>
                        </button>
                        <button
                            aria-label={`Toggle tile ${alphanumericCoords}`}
                            className={styles.back}
                            data-coords={alphanumericCoords}
                            onClick={onMoveClick}
                            type="button"
                        >
                            <span
                                className={`${styles.coords} d-none d-sm-block`}
                            >
                                {alphanumericCoords}
                            </span>
                        </button>
                    </>
                ) : (
                    <>
                        <div
                            className={styles.front}
                            data-coords={alphanumericCoords}
                        >
                            <span
                                className={`${styles.coords} d-none d-sm-block`}
                            >
                                {alphanumericCoords}
                            </span>
                        </div>
                        <div
                            className={styles.back}
                            data-coords={alphanumericCoords}
                        >
                            <span
                                className={`${styles.coords} d-none d-sm-block`}
                            >
                                {alphanumericCoords}
                            </span>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Tile;
