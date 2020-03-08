'use babel';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const atom_1 = require("atom");
const status_1 = __importDefault(require("./status"));
const selector_1 = __importDefault(require("./selector"));
let possibleIndentations = [];
let enableDebug = false;
const manual = new Set();
let subs;
exports.config = {
    possibleIndentations: {
        type: 'array',
        default: [2, 3, 4, 6, 8],
        items: {
            type: 'number'
        },
        order: 1
    },
    enableDebugMessages: {
        type: 'boolean',
        default: false,
        order: 2
    }
};
function activate() {
    subs = new atom_1.CompositeDisposable();
    status_1.default.activate();
    subs.add(atom.workspace.observeTextEditors((ed) => {
        run(ed);
        const sub = ed.onDidStopChanging(() => {
            run(ed);
        });
        subs.add(ed.onDidDestroy(() => {
            sub.dispose();
            manual.delete(ed);
        }));
    }), atom.workspace.onDidStopChangingActivePaneItem((item) => {
        if (item instanceof atom_1.TextEditor) {
            run(item);
        }
        else {
            status_1.default.update();
        }
    }), atom.commands.add('atom-text-editor', {
        'indent-detective:choose-indent': () => select()
    }), atom.config.observe('indent-detective.possibleIndentations', (opts) => {
        possibleIndentations = opts;
    }), atom.config.observe('indent-detective.enableDebugMessages', (val) => {
        enableDebug = val;
    }));
}
exports.activate = activate;
function deactivate() {
    subs.dispose();
    manual.clear();
    status_1.default.deactivate();
}
exports.deactivate = deactivate;
function consumeStatusBar(bar) {
    status_1.default.consumeStatusBar(bar);
}
exports.consumeStatusBar = consumeStatusBar;
function run(editor) {
    if (editor.isDestroyed())
        return;
    if (!manual.has(editor)) {
        setSettings(editor, getIndent(editor));
    }
    status_1.default.update(editor);
}
function setSettings(editor, indent) {
    if (enableDebug) {
        console.log(`-> decided for ${indent}`);
    }
    if (indent == 0)
        return;
    if (indent == 'tab') {
        editor.setSoftTabs(false);
    }
    else if (indent >= Math.min(...possibleIndentations) && indent <= Math.max(...possibleIndentations)) {
        editor.setSoftTabs(true);
        editor.setTabLength(indent);
    }
}
function bestOf(counts) {
    let best = 0;
    let score = 0;
    for (let vote = 0; vote < counts.length; vote++) {
        if (possibleIndentations.indexOf(vote) > -1 &&
            counts[vote] > score) {
            best = vote;
            score = counts[vote];
        }
    }
    return best;
}
function getIndent(editor) {
    let row = -1;
    let counts = [];
    let previousIndent = 0;
    let previousDiff = 0;
    let numberOfCounts = 0;
    for (const line of editor.getBuffer().getLines()) {
        if (numberOfCounts > 150)
            break;
        row += 1;
        if (!isValidLine(row, line, editor))
            continue;
        const indent = lineIndent(line);
        if (indent == 'tab')
            return 'tab';
        const diff = Math.abs(indent - previousIndent);
        if (diff == 0) {
            if (previousDiff != 0 && indent != 0) {
                counts[previousDiff] += 1;
            }
        }
        else {
            if (!counts[diff])
                counts[diff] = 0;
            counts[diff] += 1;
            previousDiff = diff;
        }
        previousIndent = indent;
        numberOfCounts += 1;
    }
    if (enableDebug) {
        console.log(`Indent Detective report for ${editor.getPath()}`);
        console.log(counts);
    }
    return bestOf(counts);
}
function isValidLine(row, line, editor) {
    if (line.match(/^\s*$/))
        return false;
    for (const scope of editor.scopeDescriptorForBufferPosition([row, 0]).getScopesArray()) {
        if (scope.indexOf('comment') > -1 ||
            scope.indexOf('docstring') > -1 ||
            scope.indexOf('string') > -1) {
            return false;
        }
    }
    return true;
}
function lineIndent(line) {
    if (line.match(/^\t+/)) {
        return 'tab';
    }
    else {
        return line.match(/^([ ]*)/)[0].length;
    }
}
function select() {
    const possibleIndentations_length = possibleIndentations.length;
    let items = new Array(possibleIndentations_length + 2);
    items[1] = { text: 'Automatic', length: 'auto' };
    for (let ind = 0; ind < possibleIndentations_length; ind++) {
        items[ind + 1] = { text: `${possibleIndentations[ind]} Spaces`, length: ind };
    }
    items[possibleIndentations_length] = { text: 'Tabs', length: 'tab' };
    selector_1.default.show(items, ({ text, length } = {}) => {
        const editor = atom.workspace.getActiveTextEditor();
        if (editor instanceof atom_1.TextEditor) {
            if (text == 'Automatic') {
                manual.delete(editor);
                run(editor);
            }
            else {
                setSettings(editor, length);
                manual.add(editor);
                status_1.default.update(editor);
            }
        }
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZW50LWRldGVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL2xpYi9pbmRlbnQtZGV0ZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQTs7Ozs7O0FBSVgsK0JBQXNEO0FBR3RELHNEQUE2QjtBQUM3QiwwREFBaUM7QUFHakMsSUFBSSxvQkFBb0IsR0FBa0IsRUFBRSxDQUFDO0FBRTdDLElBQUksV0FBVyxHQUFHLEtBQUssQ0FBQTtBQUN2QixNQUFNLE1BQU0sR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFBO0FBQ3hCLElBQUksSUFBeUIsQ0FBQTtBQUVoQixRQUFBLE1BQU0sR0FBRztJQUNwQixvQkFBb0IsRUFBRTtRQUNwQixJQUFJLEVBQUUsT0FBTztRQUNiLE9BQU8sRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDeEIsS0FBSyxFQUFFO1lBQ0wsSUFBSSxFQUFFLFFBQVE7U0FDZjtRQUNELEtBQUssRUFBRSxDQUFDO0tBQ1Q7SUFDRCxtQkFBbUIsRUFBRTtRQUNuQixJQUFJLEVBQUUsU0FBUztRQUNmLE9BQU8sRUFBRSxLQUFLO1FBQ2QsS0FBSyxFQUFFLENBQUM7S0FDVDtDQUNGLENBQUM7QUFFRixTQUFnQixRQUFRO0lBQ3RCLElBQUksR0FBRyxJQUFJLDBCQUFtQixFQUFFLENBQUE7SUFDaEMsZ0JBQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQTtJQUVqQixJQUFJLENBQUMsR0FBRyxDQUNOLElBQUksQ0FBQyxTQUFTLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRTtRQUN2QyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUE7UUFDUCxNQUFNLEdBQUcsR0FBRyxFQUFFLENBQUMsaUJBQWlCLENBQUMsR0FBRyxFQUFFO1lBQ3BDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUNULENBQUMsQ0FBQyxDQUFBO1FBQ0Ys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