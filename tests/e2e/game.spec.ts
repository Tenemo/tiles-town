import { expect, test } from '@playwright/test';
import { GAME_ROUTES, type NewGameResponse } from '@tiles-town/contracts';
import { solveBoard } from '../support/solveBoard';
import { createBrowserErrorTracker } from './support/errorTracking';

test.describe('Tiles Town', () => {
    test('loads the game and starts a new board', async ({ page }) => {
        const errorTracker = createBrowserErrorTracker();
        errorTracker.attachToPage(page, 'game-start');

        await page.goto('/');

        await expect(
            page.getByRole('button', { name: 'New Game' }),
        ).toBeVisible();
        await expect(page.getByText('High Scores:')).toBeVisible();

        await page.getByLabel('Board size:').selectOption('4');

        const newGameResponsePromise = page.waitForResponse(
            (response) =>
                response.url().endsWith(GAME_ROUTES.newGame) &&
                response.request().method() === 'POST',
        );

        await page.getByRole('button', { name: 'New Game' }).click();

        const newGameResponse = await newGameResponsePromise;
        const body = (await newGameResponse.json()) as NewGameResponse;

        expect(body.size).toBe(4);
        expect(body.board).toHaveLength(4);
        await expect(page.getByRole('button', { name: 'Restart' })).toBeEnabled();
        errorTracker.assertClean();
    });

    test('completes a game and shows the result on the scoreboard', async ({
        page,
        request,
    }) => {
        const errorTracker = createBrowserErrorTracker();
        errorTracker.attachToPage(page, 'game-win');

        const playerName = `E2E ${Date.now()}`;

        await page.goto('/');
        await page.getByLabel('Player name to show on the scoreboard:').fill(
            playerName,
        );
        await page.getByLabel('Board size:').selectOption('4');

        const newGameResponsePromise = page.waitForResponse(
            (response) =>
                response.url().endsWith(GAME_ROUTES.newGame) &&
                response.request().method() === 'POST',
        );

        await page.getByRole('button', { name: 'New Game' }).click();

        const newGameResponse = await newGameResponsePromise;
        const body = (await newGameResponse.json()) as NewGameResponse;
        const winningMoves = solveBoard(body.board);
        const winResponse = await request.put(GAME_ROUTES.winGame(body.gameId), {
            data: {
                moves: winningMoves,
                playerName,
            },
        });

        expect(winResponse.ok()).toBeTruthy();

        await page.reload();
        await expect(page.getByRole('cell', { name: playerName })).toBeVisible();
        errorTracker.assertClean();
    });
});
