// The puzzle format defined in this file is ported directly
// from the open source Lichess puzzle database:
// https://database.lichess.org/#puzzles. The Lichess puzzles
// themselves are licensed via CC0.

export interface Puzzle {
  puzzleId: string;
  FEN: string;
  moves: string[];
  rating: number;
  ratingDeviation: number;
  popularity: number;
  nbPlays: number;
  themes: string;
  gameUrl: string;
  openingTags: string;
}
