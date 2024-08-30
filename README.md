# Chess

Experiments with Chess.

Uses a [10x12 mailbox](https://www.chessprogramming.org/10x12_Board).

Things I'd do differently on a second go:

- Use PGN from the get-go (looking at you, `Chess#move`).
- Exclusively use mailbox indexes, avoiding the 64-length pieces array
  via `Chess#_pieces`.
- Only worry about black pieces in the engine since white is implied
  by the player.

## Kudos

- Piece set: [caliente](https://github.com/avi-0/caliente).
- [lichess](https://lichess.org/)
- [Chess Programming wiki](https://www.chessprogramming.org/Main_Page)
- [sunfish](https://github.com/thomasahle/sunfish/blob/master/sunfish.py)
