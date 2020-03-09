'use babel';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const atom_1 = require("atom");
const status_1 = __importDefault(require("./status"));
const selector_1 = require("./selector");
let possibleIndentations = [];
let enableDebug = false;
let manual = new Set();
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
        default: true,
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
        'indent-detective:choose-indent': function () { selector_1.selector_show(subs); }
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
function setSettings(editor, length) {
    if (enableDebug) {
        console.log(`-> decided for ${length}`);
    }
    if (length == 0)
        return;
    if (length == "tab") {
        editor.setSoftTabs(false);
    }
    else if (length >= Math.min(...possibleIndentations) && length <= Math.max(...possibleIndentations)) {
        editor.setSoftTabs(true);
        editor.setTabLength(length);
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
        return "tab";
    }
    else {
        return line.match(/^([ ]*)/)[0].length;
    }
}
function setIndent(editor, indent) {
    if (indent.text == "Automatic") {
        manual.delete(editor);
        run(editor);
    }
    else {
        setSettings(editor, indent.length);
        manual.add(editor);
        status_1.default.update(editor);
    }
}
exports.setIndent = setIndent;
function getItemsList() {
    possibleIndentations = atom.config.get('indent-detective.possibleIndentations');
    const possibleIndentations_length = possibleIndentations.length;
    let items = new Array(possibleIndentations_length + 2);
    items[0] = { text: "Automatic", length: 0 };
    for (let ind = 0; ind < possibleIndentations_length; ind++) {
        items[ind + 1] = { text: `${possibleIndentations[ind]} Spaces`, length: ind };
    }
    items[possibleIndentations_length] = { text: "Tabs", length: "tab" };
    return items;
}
exports.getItemsList = getItemsList;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZW50LWRldGVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL2xpYi9pbmRlbnQtZGV0ZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQTs7Ozs7O0FBRVgsK0JBQXNEO0FBSXRELHNEQUE2QjtBQUM3Qix5Q0FBd0M7QUFLeEMsSUFBSSxvQkFBb0IsR0FBa0IsRUFBRSxDQUFDO0FBRTdDLElBQUksV0FBVyxHQUFHLEtBQUssQ0FBQTtBQUN2QixJQUFJLE1BQU0sR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFBO0FBQ3RCLElBQUksSUFBeUIsQ0FBQTtBQUVoQixRQUFBLE1BQU0sR0FBRztJQUNwQixvQkFBb0IsRUFBRTtRQUNwQixJQUFJLEVBQUUsT0FBTztRQUNmLE9BQU8sRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDbEIsS0FBSyxFQUFFO1lBQ1QsSUFBSSxFQUFFLFFBQVE7U0FDZjtRQUNELEtBQUssRUFBRSxDQUFDO0tBQ1Q7SUFDRCxtQkFBbUIsRUFBRTtRQUNuQixJQUFJLEVBQUUsU0FBUztRQUNqQixPQUFPLEVBQUUsSUFBSTtRQUNQLEtBQUssRUFBRSxDQUFDO0tBQ2I7Q0FDRixDQUFBO0FBRUQsU0FBZ0IsUUFBUTtJQUN0QixJQUFJLEdBQUcsSUFBSSwwQkFBbUIsRUFBRSxDQUFBO0lBQ2hDLGdCQUFNLENBQUMsUUFBUSxFQUFFLENBQUE7SUFFakIsSUFBSSxDQUFDLEdBQUcsQ0FDSixJQUFJLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUU7UUFDdkMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBQ1AsTUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsRUFBRTtZQUNwQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUE7UUFDVCxDQUFDLENBQUMsQ0FBQTtRQUNG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