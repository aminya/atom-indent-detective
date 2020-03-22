import { TextEditor } from "atom";
import { StatusBar } from "atom/status-bar";
export declare type lengthSetting = number | "tab";
export declare type IndentSetting = {
    text: string;
    length: lengthSetting;
};
export declare const config: {
    possibleIndentations_str: {
        type: string;
        default: string[];
        items: {
            type: string;
        };
        title: string;
        description: string;
        order: number;
    };
};
export declare function activate(): void;
export declare function deactivate(): void;
export declare function consumeStatusBar(bar: StatusBar): void;
export declare function setIndent(editor: TextEditor, indent: IndentSetting): void;
