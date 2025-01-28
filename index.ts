import { Player } from './types/player';
import { Point, PointsData, Score } from './types/score';
// import { none, Option, some, match as matchOpt } from 'fp-ts/Option';
// import { pipe } from 'fp-ts/lib/function';

// -------- Tooling functions --------- //

export const playerToString = (player: Player) => {
  switch (player) {
    case 'PLAYER_ONE':
      return 'Player 1';
    case 'PLAYER_TWO':
      return 'Player 2';
  }
};
export const otherPlayer = (player: Player) => {
  switch (player) {
    case 'PLAYER_ONE':
      return 'PLAYER_TWO';
    case 'PLAYER_TWO':
      return 'PLAYER_ONE';
  }
};
// Exercice 1 :
export const pointToString = (point: Point): string =>{
  switch (point) {
    case 0:
      return 'Love';
    case 15:
      return '15';
    case 30:
      return '30';
    case 40:
      return '40';
    default:
      throw new Error(`Unknown point value: ${point}`);
  }};

export const scoreToString = (score: Score): string =>{
  switch (score.kind) {
    case 'POINTS': {
      const { PLAYER_ONE, PLAYER_TWO } = score.pointsData;
      return `Player 1: ${pointToString(PLAYER_ONE)}, Player 2: ${pointToString(PLAYER_TWO)}`;
    }
    case 'GAME':
      return `${playerToString(score.player)} wins the game`;
    case 'DEUCE':
      return 'Deuce';
    case 'FORTY':
      return `${playerToString(score.player)}: 40, ${playerToString(
        otherPlayer(score.player)
      )}: ${pointToString(score.otherPoint)}`;
    case 'ADVANTAGE':
      return `Advantage ${playerToString(score.player)}`;
    default:
      throw new Error(`Unknown score type`);
  }
};

export const scoreWhenDeuce = (winner: Player): Score => {
  return {
    kind: 'ADVANTAGE',
    player: winner,
  };
};

export const scoreWhenAdvantage = (
  advantagedPlayer: Player,
  winner: Player
): Score => {
  if (advantagedPlayer === winner) {
    return {
      kind: 'GAME',
      player: winner,
    };
  } else {
    return {
      kind: 'DEUCE',
    };
  }};


  export type Forty = {
    kind: 'FORTY';
    player: Player;
    otherPoint: Point;
  };
  

export const scoreWhenForty = (
  currentForty: Forty, // TO UPDATE WHEN WE KNOW HOW TO REPRESENT FORTY
  winner: Player
): Score => {
  if (currentForty.player === winner) {
    // Le joueur ayant 40 points gagne
    return {
      kind: 'GAME',
      player: winner,
    };
  } else {
    // L'autre joueur gagne
    const { otherPoint } = currentForty;
    if (otherPoint === 30) {
      // Si l'autre joueur a 30 points, le score devient Deuce
      return {
        kind: 'DEUCE',
      };
    } else {
      // Sinon, l'autre joueur voit ses points augmenter
      const nextPoint: Point = otherPoint === 15 ? 30 : 15; // Increment logic
      return {
        kind: 'FORTY',
        player: currentForty.player,
        otherPoint: nextPoint,
      };
    }
  }
};

export const scoreWhenGame = (winner: Player): Score => {
  return {
    kind: 'GAME',
    player: winner,
  };
};

// Exercice 2
// Tip: You can use pipe function from fp-ts to improve readability.
// See scoreWhenForty function above.



import { some, none, Option, match as matchOpt } from 'fp-ts/Option';
import { pipe } from 'fp-ts/lib/function';

export const incrementPoint = (point: Point): Option<Point> => {
  switch (point) {
    case 0: // Love → 15
      return some(15);
    case 15: // 15 → 30
      return some(30);
    case 30: // 30 → 40
      return none; // Pas d'incrément au-delà de 30 (géré dans `scoreWhenPoint`)
    default:
      throw new Error(`Invalid point: ${point}`);
  }
};



export const scoreWhenPoint = (current: PointsData, winner: Player): Score => {
  const winnerPoints = current[winner];
  return pipe(
    incrementPoint(winnerPoints), // Tentative d'incrémentation
    matchOpt(
      // Cas où les points passent à 40
      () => ({
        kind: 'FORTY',
        player: winner,
        otherPoint: current[otherPlayer(winner)],
      }),
      // Cas où les points augmentent mais restent dans Points
      (newPoint): Score => ({
        kind: 'POINTS', // Ici, on s'assure que c'est bien un type Points
        pointsData: {
          ...current,
          [winner]: newPoint,
        },
      })
    )
  );
  
};

export const score = (currentScore: Score, winner: Player): Score => {
  switch (currentScore.kind) {
    case 'POINTS':
      // Appeler scoreWhenPoint pour gérer les scores en dessous de 40
      return scoreWhenPoint(currentScore.pointsData, winner);

    case 'FORTY':
      // Appeler scoreWhenForty pour gérer les cas où un joueur a 40 points
      return scoreWhenForty(currentScore, winner);

    case 'DEUCE':
      // Appeler scoreWhenDeuce pour gérer le cas d'égalité à 40-40
      return scoreWhenDeuce(winner);

    case 'ADVANTAGE':
      // Appeler scoreWhenAdvantage pour gérer l'état d'avantage
      return scoreWhenAdvantage(currentScore.player, winner);

    case 'GAME':
      // Si un joueur a déjà gagné, retourner le score inchangé
      return currentScore;

    default:
      throw new Error(`Unknown score kind: ${(currentScore as Score).kind}`);
  }};
