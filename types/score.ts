import { Player } from './player';

// Surely not the best choice
export type Point = number;

export type PointsData = {
  PLAYER_ONE: Point;
  PLAYER_TWO: Point;
};

export type Points = {
  kind: 'POINTS';
  pointsData: PointsData;
};

export const points = (
  playerOnePoints: Point,
  playerTwoPoints: Point
): Points => ({
  kind: 'POINTS',
  pointsData: {
    PLAYER_ONE: playerOnePoints,
    PLAYER_TWO: playerTwoPoints,
  },
});

// Exerice 0: Write all type constructors of Points, Deuce, Forty and Advantage types.


// Ajout des types pour Forty et Advantage

export type Forty = {
  kind: 'FORTY';
  player: Player; // Joueur ayant 40 points
  otherPoint: Point; // Points de l'autre joueur
};

export const forty = (player: Player, otherPoint: Point): Forty => ({
  kind: 'FORTY',
  player,
  otherPoint,
});

// Ajout du type pour Deuce

export type Deuce = {
  kind: 'DEUCE';
};

export const deuce = (): Deuce => ({
  kind: 'DEUCE',
});

// Ajout du type pour Advantage

export type Advantage = {
  kind: 'ADVANTAGE';
  player: Player; // Joueur ayant l'avantage
};

export const advantage = (player: Player): Advantage => ({
  kind: 'ADVANTAGE',
  player,
});

// Définition du type global Score avec tous les états possibles

export type Score = Points | Game | Deuce | Forty | Advantage;



//----------------------------------------------
export type Game = {
  kind: 'GAME';
  player: Player; // Player has won
};

export const game = (winner: Player): Game => ({
  kind: 'GAME',
  player: winner,
});

//----------------------------------------------


