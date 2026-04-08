# API endpoints

The backend routes live under `/api`.
The request and response payloads are defined in `packages/contracts`.

## Health check

- `GET /api/health-check`
- success response: `200 OK`

```text
OK
```

## Create game

- `POST /api/game/new`
- validates `size` as an integer between `4` and `16`
- `seed` is optional, may be blank, and is trimmed before game generation
- `easyMode` is optional and defaults to `false`
- `previousId` is optional; when provided, any unfinished game with that id is
  deleted before the new game is created
- success response: `200 OK`

```json
{
    "board": [[1, 0, 1, 2], [0, 1, 0, 2], [1, 0, 1, 2], [2, 2, 2, 2]],
    "gameId": "0123456789abcdef0123456789abcdef",
    "size": 4
}
```

- failure responses:
- `400` for invalid request bodies

## Complete game

- `PUT /api/game/:id`
- `id` must be a 32-character lowercase alphanumeric game id
- `moves` must be an array of alphanumeric move strings with at most four
  characters each
- `playerName` is optional, is trimmed before persistence, and falls back to
  `anonymous` when blank
- success response for a newly completed game: `200 OK`

```json
{
    "score": 12345,
    "time": 1876,
    "moveCount": 12,
    "seed": "game-seed",
    "isSeedCustom": false
}
```

- alternate success responses:
- `404` with `{ "info": "Game doesn't exist" }` when the game id is unknown
- `200` with `info`, `isWon`, and `score` when the game was already completed

- failure responses:
- `400` with `{ "info": "Illegal move sequence" }` for invalid or non-winning
  move sequences

## High scores

- `GET /api/game/highScores`
- returns up to 20 completed games
- excludes custom-seed runs, easy-mode runs, and blank player names
- sorts by score descending, then board size descending
- success response: `200 OK`

```json
[
    {
        "game_score": 12345,
        "game_player_name": "Piotr",
        "game_size": 6,
        "game_move_count": 18,
        "game_time": 1876
    }
]
```
