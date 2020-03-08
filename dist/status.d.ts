import { TextEditor } from "atom";
import { StatusBar } from "atom/status-bar";
declare const _default: {
    activate(): any;
    deactivate(): any;
    consumeStatusBar(bar: StatusBar): any;
    createView(): () => Promise<void> | null;
    update(editor?: TextEditor | undefined): any;
    updateText(editor: TextEditor): string | undefined;
    clearText(): "" | undefined;
};
export default _default;
