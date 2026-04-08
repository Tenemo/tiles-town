import { render, screen } from '@testing-library/react';

import { initialGameState } from 'store/game/gameReducer';

import InfoPanels from './InfoPanels';

describe('InfoPanels', () => {
    it('renders previous game values even when they are zero', () => {
        render(
            <InfoPanels
                game={{
                    ...initialGameState,
                    previous: {
                        ...initialGameState.previous,
                        gameId: 'won-game',
                        size: 4,
                        score: 0,
                        moveCount: 0,
                        time: 0,
                    },
                }}
            />,
        );

        expect(
            screen.getByRole('heading', { name: 'Previous won game' }),
        ).toBeVisible();
        expect(screen.getByText('Score: 0')).toBeVisible();
        expect(screen.getByText('Size: 4')).toBeVisible();
        expect(screen.getByText('Move count: 0')).toBeVisible();
        expect(screen.getByText('Time: 0 s')).toBeVisible();
    });
});
