import { expect, test } from '@playwright/test';
import {
    GAME_ROUTES,
    type NewGameResponse,
    type WinGameResponse,
} from '@tiles-town/contracts';
import { solveBoard } from '@tiles-town/testkit';
import { createBrowserErrorTracker } from './support/errorTracking';

test.describe('tiles town', () => {
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
        await expect(
            page.getByRole('button', { name: 'Restart' }),
        ).toBeEnabled();
        errorTracker.assertClean();
    });

    test('completes a game through the browser and shows the result on the scoreboard', async ({
        page,
    }) => {
        const errorTracker = createBrowserErrorTracker();
        errorTracker.attachToPage(page, 'game-win');

        const playerName = `E2E ${Date.now()}`;

        await page.goto('/');
        await page
            .getByLabel('Player name to show on the scoreboard:')
            .fill(playerName);
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

        for (const move of winningMoves) {
            await page
                .locator(`button[data-coords="${move}"]`)
                .first()
                .click({ force: true });
        }

        await expect(
            page.getByRole('cell', { name: playerName }),
        ).toBeVisible();
        errorTracker.assertClean();
    });

    test('rejects out-of-range moves with a stable client error', async ({
        request,
    }) => {
        const newGameResponse = await request.post(GAME_ROUTES.newGame, {
            data: {
                size: 4,
            },
        });
        const body = (await newGameResponse.json()) as NewGameResponse;

        expect(newGameResponse.ok()).toBeTruthy();

        const invalidMoveResponse = await request.put(
            GAME_ROUTES.winGame(body.gameId),
            {
                data: {
                    moves: ['P16'],
                    playerName: 'playwright-regression',
                },
            },
        );
        const invalidMoveBody =
            (await invalidMoveResponse.json()) as WinGameResponse;

        expect(invalidMoveResponse.status()).toBe(400);
        expect(invalidMoveBody).toMatchObject({
            info: 'Illegal move sequence',
        });
    });
});
