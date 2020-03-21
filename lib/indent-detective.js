"use strict"
// TODO: Converting to wasm using https://docs.assemblyscript.org/
Object.defineProperty(exports, "__esModule", { value: true })
/*
// For Benchmark:
let ti_activate = window.performance.now() // start parsing
let tf_activate: number // finished activating
let ti_run: number // start running
let tf_run: number // finished running
*/
const atom_1 = require("atom")
const status_1 = require("./status")
const selector_1 = require("./selector")
// TODO: make these two const
let possibleIndentations
// const enableDebug = false
const manual = new Set()
let subs
let statusItem // undefined when statusbar isn't consumed
exports.config = {
    // HACK: Array of strings because of Atom's setting issue (settings-view)
    possibleIndentations_str: {
        type: "array",
        default: ["2", "3", "4", "6", "8"],
        items: { type: "string" },
        title: "possible indentations",
        description:
            "Write possible indentations that package should consider (changing requires Atom's restart/reload)",
        order: 1
    }
}
function activate() {
    subs = new atom_1.CompositeDisposable() // subscriptions
    // Getting possibleIndentations from config
    possibleIndentations = atom.config.get("indent-detective.possibleIndentations_str").map(function(el) {
        return parseInt(el, 10)
    }) // because of the HACK
    // Calculating SelectorItems
    exports.SelectorItems = getItemsList()
    subs.add(
        // Called for every TextEditor opening/closing
        atom.workspace.observeTextEditors(function(editor) {
            // ti_run = window.performance.now()
            run(editor)
            const sub = editor.onDidStopChanging(() => {
                run(editor)
            })
            subs.add(
                editor.onDidDestroy(() => {
                    sub.dispose()
                    manual.delete(editor)
                })
            )
            // tf_run = window.performance.now()
            // console.log("indent detective run  "+ (tf_run-ti_run) + "  ms")
        }),
        atom.workspace.onDidStopChangingActivePaneItem(item => {
            if (item instanceof atom_1.TextEditor) {
                run(item)
            } else {
                if (statusItem !== undefined) {
                    statusItem.updateDisplay()
                }
            }
        }),
        atom.commands.add("atom-text-editor", {
            "indent-detective:choose-indent"() {
                selector_1.selector_show(subs)
            }
        })
    )
    // tf_activate = window.performance.now()
    // console.log("indent detective activation  "+ (tf_activate - ti_activate) + "  ms")
}
exports.activate = activate
function deactivate() {
    subs.dispose()
    manual.clear()
    if (statusItem !== undefined) {
        // if doesn't exist yet
        statusItem.destroy()
    }
}
exports.deactivate = deactivate
// Called only once for each Atom session
function consumeStatusBar(bar) {
    statusItem = new status_1.IndentStatusItem()
    statusItem.consumeStatusBar(bar)
}
exports.consumeStatusBar = consumeStatusBar
// Runs for every TextEditor opening/closing
function run(editor) {
    if (editor.isDestroyed()) {
        return
    }
    if (!manual.has(editor)) {
        setSettings(editor, getIndent(editor))
    }
    if (statusItem !== undefined) {
        // Initially may be undefined (activate() called before consumeStatusBar())
        statusItem.updateDisplay(editor)
    }
}
function setSettings(editor, length) {
    // if (enableDebug) {
    //     console.log(`-> decided for ${length}`)
    // }
    if (length === 0) return // default settings
    if (length === "tab") {
        editor.setSoftTabs(false)
    } else if (length >= Math.min(...possibleIndentations) && length <= Math.max(...possibleIndentations)) {
        editor.setSoftTabs(true)
        editor.setTabLength(length)
    }
}
function bestOf(counts) {
    let best = 0
    let score = 0
    for (let vote = 0; vote < counts.length; vote++) {
        if (possibleIndentations.indexOf(vote) > -1 && counts[vote] > score) {
            best = vote
            score = counts[vote]
        }
    }
    return best
}
function getIndent(editor) {
    let row = -1
    const counts = []
    let previousIndent = 0
    let previousDiff = 0
    let numberOfCounts = 0
    const editorLines = editor.getBuffer().getLines()
    for (const line of editorLines) {
        if (numberOfCounts > 150) break
        row += 1
        if (!isValidLine(row, line, editor)) continue
        const indent = lineIndent(line)
        if (indent == null) {
            // TODO do we need this?
            continue
        }
        if (indent === "tab") return "tab"
        const diff = Math.abs(indent - previousIndent)
        if (diff === 0) {
            if (previousDiff !== 0 && indent !== 0) {
                counts[previousDiff] += 1
            }
        } else {
            if (!counts[diff]) counts[diff] = 0
            counts[diff] += 1
            previousDiff = diff
        }
        previousIndent = indent
        numberOfCounts += 1
    }
    // if (enableDebug) {
    //     console.log(`Indent Detective report for ${editor.getPath()}`)
    //     console.log(counts)
    // }
    return bestOf(counts)
}
function isValidLine(row, line, editor) {
    // empty line
    if (line.match(/^\s*$/)) return false
    // line is part of a comment or string
    for (const scope of editor.scopeDescriptorForBufferPosition([row, 0]).getScopesArray()) {
        if (
            scope.indexOf("comment") > -1 ||
            scope.indexOf("docstring") > -1 ||
            scope.indexOf("string") > -1
        ) {
            return false
        }
    }
    return true
}
function lineIndent(line) {
    if (line.match(/^\t+/)) {
        return "tab"
    } else {
        const match = line.match(/^([ ]*)/)
        // TODO: do we need checking?
        if (match) {
            return match[0].length
        } else {
            return null
        }
    }
}
function setIndent(editor, indent) {
    if (indent.text === "Automatic") {
        manual.delete(editor)
        run(editor)
    } else {
        setSettings(editor, indent.length)
        manual.add(editor)
        if (statusItem !== undefined) {
            statusItem.updateDisplay(editor)
        }
    }
}
exports.setIndent = setIndent
// Called only once in activate to calculate SelectorItems
function getItemsList() {
    const possibleIndentations_length = possibleIndentations.length
    // items declaration (Array<object> template)
    const items = new Array(possibleIndentations_length + 2)
    // items filling
    items[0] = { text: "Automatic", length: 0 }
    for (let ind = 0; ind < possibleIndentations_length; ind++) {
        items[ind + 1] = { text: `${possibleIndentations[ind]} Spaces`, length: possibleIndentations[ind] }
    }
    items[possibleIndentations_length + 1] = { text: "Tabs", length: "tab" }
    return items // SelectorItems
}
//# sourceMappingURL=indent-detective.js.map
