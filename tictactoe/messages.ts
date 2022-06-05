export interface ICommand {
    action: string;
    data: MoveCmd | InitCmd | ResetCmd;
}

// triggered by client upon clicking
export interface MoveCmd {
    // squares: Array<string | null>;
    move: number;
    playerSign: string;
}

// triggered by server upon room filled
export interface InitCmd {
    playerSign: string;
    playerTurn: boolean;
    squares: Array<string | null>;
}

// triggered by client
export interface ResetCmd {}

// triggered by server as workaround Heroku's 55s timeout
export interface PingCmd {}
