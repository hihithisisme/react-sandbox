export interface ICommand {
    action: string;
    data: MoveCmd | InitCmd | ResetCmd;
}

// triggered by client upon clicking
export interface MoveCmd {
    move: number;
    playerSign: string;
    playerRemainingPieces: number[];
    oppRemainingPieces: number[];
}

// triggered by server upon room filled
export interface InitCmd {
    playerSign: string;
    playerTurn: boolean;
    squares: Array<string | null>;
    playerRemainingPieces: number[];
    oppRemainingPieces: number[];
}

// triggered by client
export interface ResetCmd {}
