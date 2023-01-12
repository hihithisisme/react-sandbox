import { HeroInfo } from "../components/SanGuoSha";

export enum SGSAction {
    INIT_CMD = 'INIT',
    DRAW_CMD = 'DRAW',
    RULER_REQ = 'RULER',
    SHOW_RULER_CMD = 'SHOW_RULER',
    REPLACE_REQ = 'REPLACE',
    SUBMIT_REQ = 'SUBMIT',
    SHOW_CMD = 'SHOW',
    RESET_CMD = 'RESET',
}

export interface SGSCommand {
    action: SGSAction;
    data?: DrawCmd | InitCmd | SubmitReq | ShowRulerCmd | ShowCmd;
}

/* 
Commands for Websocket
- INIT: start the process (only aesthetic change). server tells everyone who the ruler is
- DRAW: draw fixed set of cards (chosen by server) [issued by server]
    - RULER: ask server to issue more cards (ruler cards) to one client (but still use DRAW to do so) [issued by client]
- REPLACE: replace one card (chosen by server) [issued by client]
- SUBMIT: [issued by client] indicate to server what client chose
- SHOW: [issued by server once all clients have submitted] display to all clients, the selection of cards
    - SHOW_RULER: [issued by server when ruler client has submitted] show to all clients which Hero the ruler has selected 
*/

export interface InitCmd {
    rulerId: string;
}

export interface DrawCmd {
    heroes: HeroInfo[];
}

export interface RulerReq { }

export interface ShowRulerCmd {
    rulerId: string;
    hero: HeroInfo;
}

export interface ReplaceReq { }

export interface SubmitReq {
    hero: HeroInfo;
}

export interface ShowCmd {
    playersSelection: Record<string, HeroInfo>;
}

export interface ResetCmd { }

// triggered by server as workaround Heroku's 55s timeout
export interface PingCmd { }
