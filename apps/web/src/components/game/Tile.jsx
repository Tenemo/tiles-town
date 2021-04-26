import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { numToAlpha } from '../../helpers/helpers';

const Tile = ({ type, coords, size, onMoveClick, isDisabled }) => {
    let tileClass = classNames({
        tile: true,
        'coords d-none d-sm-block': type === 3 || type === 4,
        'inactive': type === 2,
        'active': type === 1,
        'flipped': type === 0,
        'disabled': isDisabled
    });
    coords = numToAlpha(coords, size, type);
    return (
        <div className={tileClass}>
            <div className="tileInside">
                <div className="front" coords={coords} onClick={onMoveClick}>
                    <span className="coords d-none d-sm-block">{coords}</span>
                </div>
                <div className="back" coords={coords} onClick={onMoveClick}>
                    <span className="coords d-none d-sm-block">{coords}</span>
                </div>
            </div>
        </div>
    );
};

Tile.propTypes = {
    type: PropTypes.number.isRequired,
    coords: PropTypes.array.isRequired,
    size: PropTypes.number.isRequired,
    onMoveClick: PropTypes.func,
    isDisabled: PropTypes.bool
};

export default Tile;