import { ReactElement, MouseEvent } from 'react';
import {
    TileState,
    formatMoveCoordinates,
    isPlayableTile,
} from '@tiles-town/game-core';

import styles from './tile.module.scss';

type Props = {
    tile: number;
    rowIndex: number;
    columnIndex: number;
    size: number;
    onMoveClick: (event: MouseEvent<HTMLElement>) => void;
    isDisabled: boolean;
};

const Tile = ({
    tile,
    rowIndex,
    columnIndex,
    size,
    onMoveClick,
    isDisabled,
}: Props): ReactElement => {
    const isInteractive = !isDisabled && isPlayableTile(tile);
    const typeClass =
        tile === TileState.Flipped
            ? styles.flipped
            : tile === TileState.Blocked
              ? styles.inactive
              : styles.active;
    const alphanumericCoords = formatMoveCoordinates(
        [columnIndex, rowIndex],
        size,
    );
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
