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