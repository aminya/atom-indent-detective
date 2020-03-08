import { StatusBar } from "atom/status-bar";
export declare const config: {
    possibleIndentations: {
        type: string;
        default: number[];
        items: {
            type: string;
        };
        order: number;
    };
    enableDebugMessages: {
        type: string;
        default: boolean;
        order: number;
    };
};
export declare function activate(): void;
export declare function deactivate(): void;
export declare function consumeStatusBar(bar: StatusBar): void;
