'use babel';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const atom_1 = require("atom");
const status_1 = require("./status");
const selector_1 = require("./selector");
let possibleIndentations;
const enableDebug = false;
let manual = new Set();
let subs;
let statusItem;
exports.config = {
    possibleIndentations_str: {
        type: "array",
        default: ["2", "3", "4", "6", "8"],
        items: { type: "string" },
        title: "possible indentations",
        description: 'Write possible indentations that package should consider',
        order: 1
    }
};
function activate() {
    subs = new atom_1.CompositeDisposable();
    possibleIndentations = atom.config.get('indent-detective.possibleIndentations_str')
        .map(function (el) {
        return parseInt(el);
    });
    subs.add(atom.workspace.observeTextEditors(function (editor) {
        run(editor);
        const sub = editor.onDidStopChanging(() => {
            run(editor);
        });
        subs.add(editor.onDidDestroy(() => {
            sub.dispose();
            manual.delete(editor);
        }));
    }), atom.workspace.onDidStopChangingActivePaneItem((item) => {
        if (item instanceof atom_1.TextEditor) {
            run(item);
        }
        else {
            if (statusItem != undefined) {
                statusItem.updateDisplay();
            }
        }
    }), atom.commands.add('atom-text-editor', {
        'indent-detective:choose-indent': function () {
            selector_1.selector_show(subs);
        }
    }));
}
exports.activate = activate;
function deactivate() {
    subs.dispose();
    manual.clear();
    if (statusItem != undefined) {
        statusItem.destroy();
    }
}
exports.deactivate = deactivate;
function consumeStatusBar(bar) {
    statusItem = new status_1.IndentStatusItem();
    statusItem.consumeStatusBar(bar);
}
exports.consumeStatusBar = consumeStatusBar;
function run(editor) {
    if (editor.isDestroyed()) {
        return;
    }
    if (!manual.has(editor)) {
        setSettings(editor, getIndent(editor));
    }
    if (statusItem != undefined) {
        statusItem.updateDisplay(editor);
    }
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
        if (indent == null) {
            continue;
        }
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
        let match = line.match(/^([ ]*)/);
        if (match) {
            return match[0].length;
        }
        else {
            return null;
        }
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
        if (statusItem != undefined) {
            statusItem.updateDisplay(editor);
        }
    }
}
exports.setIndent = setIndent;
function getItemsList() {
    const possibleIndentations_length = possibleIndentations.length;
    let items = new Array(possibleIndentations_length + 2);
    items[0] = { text: "Automatic", length: 0 };
    for (let ind = 0; ind < possibleIndentations_length; ind++) {
        items[ind + 1] = { text: `${possibleIndentations[ind]} Spaces`, length: possibleIndentations[ind] };
    }
    items[possibleIndentations_length + 1] = { text: "Tabs", length: "tab" };
    return items;
}
exports.getItemsList = getItemsList;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZW50LWRldGVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL2xpYi9pbmRlbnQtZGV0ZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQTs7O0FBSVgsK0JBQW9EO0FBR3BELHFDQUF5QztBQUN6Qyx5Q0FBd0M7QUFPeEMsSUFBSSxvQkFBbUMsQ0FBQTtBQUN2QyxNQUFNLFdBQVcsR0FBRyxLQUFLLENBQUE7QUFDekIsSUFBSSxNQUFNLEdBQUcsSUFBSSxHQUFHLEVBQWMsQ0FBQTtBQUNsQyxJQUFJLElBQXlCLENBQUE7QUFDN0IsSUFBSSxVQUF3QyxDQUFBO0FBRS9CLFFBQUEsTUFBTSxHQUFHO0lBRWxCLHdCQUF3QixFQUFFO1FBQ3RCLElBQUksRUFBRSxPQUFPO1FBQ2IsT0FBTyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztRQUNsQyxLQUFLLEVBQUUsRUFBQyxJQUFJLEVBQUUsUUFBUSxFQUFDO1FBQ3ZCLEtBQUssRUFBRSx1QkFBdUI7UUFDOUIsV0FBVyxFQUFFLDBEQUEwRDtRQUN2RSxLQUFLLEVBQUUsQ0FBQztLQUNYO0NBQ0osQ0FBQTtBQUVELFNBQWdCLFFBQVE7SUFDcEIsSUFBSSxHQUFHLElBQUksMEJBQW1CLEVBQUUsQ0FBQTtJQUNoQyxvQkFBb0IsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQywyQ0FBMkMsQ0FBQztTQUM5RSxHQUFHLENBQUMsVUFBVSxFQUFVO1FBQ3JCLE9BQU8sUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFBO0lBQ3ZCLENBQUMsQ0FBQyxDQUFBO0lBRU4sSUFBSSxDQUFDLEdBQUcsQ0FFSixJQUFJLENBQUMsU0FBUyxDQUFDLGtCQUFrQixDQUFDLFVBQVUsTUFBa0I7UUFDMUQsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBQ1gsTUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsRUFBRTtZQUN0QyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUE7UUFDZixDQUFDLENBQUMsQ0FBQTtRQUNGLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxHQUFHLEVBQUU7WUFDOUIsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFBO1lBQ2IsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUN6QixDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQ1AsQ0FBQyxDQUFDLEVBRUYsSUFBSSxDQUFDLFNBQVMsQ0FBQywrQkFBK0IsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO1FBQ3BELElBQUksSUFBSSxZQUFZLGlCQUFVLEVBQUU7WUFDNUIsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFBO1NBQ1o7YUFBTTtZQUNILElBQUksVUFBVSxJQUFJLFNBQVMsRUFBRTtnQkFDekIsVUFBVSxDQUFDLGFBQWEsRUFBRSxDQUFBO2FBQzdCO1NBQ0o7SUFDTCxDQUFDLENBQUMsRUFFRixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRTtRQUNsQyxnQ0FBZ0MsRUFBRTtZQUM5Qix3QkFBYSxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ3ZCLENBQUM7S0FDSixDQUFDLENBQ0wsQ0FBQTtBQUNMLENBQUM7QUFwQ0QsNEJBb0NDO0FBRUQsU0FBZ0IsVUFBVTtJQUN0QixJQUFJLENBQUMsT0FBTyxFQUFFLENBQUE7SUFDZCxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUE7SUFDZCxJQUFJLFVBQVUsSUFBSSxTQUFTLEVBQUU7UUFDekIsVUFBVSxDQUFDLE9BQU8sRUFBRSxDQUFBO0tBQ3ZCO0FBQ0wsQ0FBQztBQU5ELGdDQU1DO0FBR0QsU0FBZ0IsZ0JBQWdCLENBQUMsR0FBYztJQUMzQyxVQUFVLEdBQUcsSUFBSSx5QkFBZ0IsRUFBRSxDQUFBO0lBQ25DLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBQTtBQUNwQyxDQUFDO0FBSEQsNENBR0M7QUFHRCxTQUFTLEdBQUcsQ0FBQyxNQUFrQjtJQUMzQixJQUFJLE1BQU0sQ0FBQyxXQUFXLEVBQUUsRUFBRTtRQUN0QixPQUFNO0tBQ1Q7SUFDRCxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRTtRQUNyQixXQUFXLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBO0tBQ3pDO0lBQ0QsSUFBSSxVQUFVLElBQUksU0FBUyxFQUFFO1FBQ3pCLFVBQVUsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUE7S0FDbkM7QUFDTCxDQUFDO0FBRUQsU0FBUyxXQUFXLENBQUMsTUFBa0IsRUFBRSxNQUFxQjtJQUMxRCxJQUFJLFdBQVcsRUFBRTtRQUNiLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLE1BQU0sRUFBRSxDQUFDLENBQUE7S0FDMUM7SUFDRCxJQUFJLE1BQU0sSUFBSSxDQUFDO1FBQUUsT0FBTTtJQUV2QixJQUFJLE1BQU0sSUFBSSxLQUFLLEVBQUU7UUFDakIsTUFBTSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQTtLQUM1QjtTQUFNLElBQUksTUFBTSxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxvQkFBb0IsQ0FBQyxJQUFJLE1BQU0sSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsb0JBQW9CLENBQUMsRUFBRTtRQUNuRyxNQUFNLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ3hCLE1BQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUE7S0FDOUI7QUFDTCxDQUFDO0FBRUQsU0FBUyxNQUFNLENBQUMsTUFBcUI7SUFDakMsSUFBSSxJQUFJLEdBQVcsQ0FBQyxDQUFBO0lBQ3BCLElBQUksS0FBSyxHQUFXLENBQUMsQ0FBQTtJQUNyQixLQUFLLElBQUksSUFBSSxHQUFHLENBQUMsRUFBRSxJQUFJLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsRUFBRTtRQUM3QyxJQUFJLG9CQUFvQixDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDdkMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssRUFBRTtZQUN0QixJQUFJLEdBQUcsSUFBSSxDQUFBO1lBQ1gsS0FBSyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQTtTQUN2QjtLQUNKO0lBQ0QsT0FBTyxJQUFJLENBQUE7QUFDZixDQUFDO0FBRUQsU0FBUyxTQUFTLENBQUMsTUFBa0I7SUFDakMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUE7SUFDWixJQUFJLE1BQU0sR0FBa0IsRUFBRSxDQUFDO0lBQy9CLElBQUksY0FBYyxHQUFHLENBQUMsQ0FBQTtJQUN0QixJQUFJLFlBQVksR0FBRyxDQUFDLENBQUE7SUFDcEIsSUFBSSxjQUFjLEdBQUcsQ0FBQyxDQUFBO0lBQ3RCLEtBQUssTUFBTSxJQUFJLElBQUksTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDLFFBQVEsRUFBRSxFQUFFO1FBQzlDLElBQUksY0FBYyxHQUFHLEdBQUc7WUFBRSxNQUFLO1FBQy9CLEdBQUcsSUFBSSxDQUFDLENBQUE7UUFDUixJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsTUFBTSxDQUFDO1lBQUUsU0FBUTtRQUM3QyxNQUFNLE1BQU0sR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUE7UUFFL0IsSUFBSSxNQUFNLElBQUksSUFBSSxFQUFFO1lBQ2hCLFNBQVE7U0FDWDtRQUVELElBQUksTUFBTSxJQUFJLEtBQUs7WUFBRSxPQUFPLEtBQUssQ0FBQTtRQUNqQyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxjQUFjLENBQUMsQ0FBQTtRQUU5QyxJQUFJLElBQUksSUFBSSxDQUFDLEVBQUU7WUFDWCxJQUFJLFlBQVksSUFBSSxDQUFDLElBQUksTUFBTSxJQUFJLENBQUMsRUFBRTtnQkFDbEMsTUFBTSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQTthQUM1QjtTQUNKO2FBQU07WUFDSCxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztnQkFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBO1lBQ25DLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7WUFDakIsWUFBWSxHQUFHLElBQUksQ0FBQTtTQUN0QjtRQUVELGNBQWMsR0FBRyxNQUFNLENBQUE7UUFDdkIsY0FBYyxJQUFJLENBQUMsQ0FBQTtLQUN0QjtJQUNELElBQUksV0FBVyxFQUFFO1FBQ2IsT0FBTyxDQUFDLEdBQUcsQ0FBQywrQkFBK0IsTUFBTSxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQTtRQUM5RCxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFBO0tBQ3RCO0lBQ0QsT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDekIsQ0FBQztBQUVELFNBQVMsV0FBVyxDQUFDLEdBQVcsRUFBRSxJQUFZLEVBQUUsTUFBa0I7SUFFOUQsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQztRQUFFLE9BQU8sS0FBSyxDQUFBO0lBR3JDLEtBQUssTUFBTSxLQUFLLElBQUksTUFBTSxDQUFDLGdDQUFnQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsY0FBYyxFQUFFLEVBQUU7UUFDcEYsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUM3QixLQUFLLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUMvQixLQUFLLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFO1lBQzlCLE9BQU8sS0FBSyxDQUFBO1NBQ2Y7S0FDSjtJQUVELE9BQU8sSUFBSSxDQUFBO0FBQ2YsQ0FBQztBQUVELFNBQVMsVUFBVSxDQUFDLElBQVk7SUFDNUIsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFO1FBQ3BCLE9BQU8sS0FBSyxDQUFBO0tBQ2Y7U0FBTTtRQUNILElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUE7UUFFakMsSUFBSSxLQUFLLEVBQUU7WUFDUCxPQUFPLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUE7U0FDekI7YUFBTTtZQUNILE9BQU8sSUFBSSxDQUFBO1NBQ2Q7S0FDSjtBQUNMLENBQUM7QUFFRCxTQUFnQixTQUFTLENBQUMsTUFBa0IsRUFBRSxNQUFxQjtJQUMvRCxJQUFJLE1BQU0sQ0FBQyxJQUFJLElBQUksV0FBVyxFQUFFO1FBQzVCLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUE7UUFDckIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFBO0tBQ2Q7U0FBTTtRQUNILFdBQVcsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBQ2xDLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUE7UUFDbEIsSUFBSSxVQUFVLElBQUksU0FBUyxFQUFFO1lBQ3pCLFVBQVUsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUE7U0FDbkM7S0FDSjtBQUNMLENBQUM7QUFYRCw4QkFXQztBQUVELFNBQWdCLFlBQVk7SUFFeEIsTUFBTSwyQkFBMkIsR0FBRyxvQkFBb0IsQ0FBQyxNQUFNLENBQUE7SUFHL0QsSUFBSSxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQWdCLDJCQUEyQixHQUFHLENBQUMsQ0FBQyxDQUFBO0lBR3JFLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFDLElBQUksRUFBRSxXQUFXLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBQyxDQUFDO0lBQzFDLEtBQUssSUFBSSxHQUFHLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRywyQkFBMkIsRUFBRSxHQUFHLEVBQUUsRUFBRTtRQUN4RCxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUMsSUFBSSxFQUFFLEdBQUcsb0JBQW9CLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxNQUFNLEVBQUUsb0JBQW9CLENBQUMsR0FBRyxDQUFDLEVBQUMsQ0FBQztLQUNyRztJQUNELEtBQUssQ0FBQywyQkFBMkIsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBQyxDQUFBO0lBRXRFLE9BQU8sS0FBSyxDQUFBO0FBQ2hCLENBQUM7QUFmRCxvQ0FlQyJ9