# Chess

Chess engine from scratch with a single UI library. Uses a [10x12
mailbox](https://www.chessprogramming.org/10x12_Board) for internal
board representation.

Things I'd do differently on a second go:

- Use PGN from the get-go (looking at you, `Chess#move`).
- Exclusively use mailbox indexes, avoiding the 64-length pieces array
  via `Chess#_pieces` and `SQUARES`.
- Only worry about black pieces in the engine since white is implied
  by the player (simplifies some edge-case annoyance).

Todos:

- [ ] Check detection, can't move into check
- [ ] Promotions
- [ ] Win/loss state

## Kudos

- [lichess](https://lichess.org/) and the piece set [caliente](https://github.com/avi-0/caliente)
- [Chess Programming wiki](https://www.chessprogramming.org/Main_Page)
- [sunfish](https://github.com/thomasahle/sunfish/blob/master/sunfish.py)
