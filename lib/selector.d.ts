import { Panel } from "atom";
import { IndentSetting } from "./indent-detective";
export declare class Selector {
    indentListView: any;
    modalPanel: Panel;
    constructor(SelectorItems: IndentSetting[]);
    show(): void;
    dispose(): void;
}
