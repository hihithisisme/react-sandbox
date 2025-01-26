import { IGameSettings, IGameState } from './data';

export interface ICommand {
    action: string;
    data: MoveCmd | InitCmd | ResetCmd;
}

// triggered by client completing a Piece movement
export interface MoveCmd {
    pieceId: string;
    // excludes the inital square
    movementPath: string[];

    // ONLY FOR DEBUGGING: do not use this value for logic
    gameState: IGameState;
}

// triggered by client
export interface ResetCmd {}

// triggered by server when client tries to issue an invalid request
// (typically one that is inconsistent with the game state)
export interface InvalidRequestCmd {
    // upon receiving this, clients should reset the game state back to the correct one
    forceGameState: IGameState;
}

// triggered by server upon room filled
export interface InitCmd {
    gameSettings: IGameSettings;
    gameState: IGameState;
}

// triggered by server as workaround Heroku's 55s timeout
export interface PingCmd {}
