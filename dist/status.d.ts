import { TextEditor } from "atom";
import { StatusBar, Tile } from "atom/status-bar";
export declare class IndentStatusItem {
    bar: StatusBar;
    tile: Tile | null;
    text: HTMLElement | null;
    view: HTMLElement;
    constructor();
    consumeStatusBar(bar: StatusBar): Tile;
    createView(): this;
    updateDisplay(editor?: TextEditor | undefined): string | undefined;
    updateText(editor: TextEditor): string | undefined;
    clearText(): "" | undefined;
    destroy(): void;
}
