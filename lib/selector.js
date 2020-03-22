"use strict"
Object.defineProperty(exports, "__esModule", { value: true })
const SelectListView = require("atom-select-list")
// TODO: observe https://github.com/atom/atom-select-list/pull/28/files
// import {SelectListView} from 'atom-select-list'
const atom_1 = require("atom")
const indent_detective_1 = require("./indent-detective")
class Selector {
    // Make a selector object (should be called once)
    constructor(SelectorItems) {
        if (!this.modalPanel) {
            // Defining a SelectListView with methods - https://github.com/atom/atom-select-list
            this.indentListView = new SelectListView({
                // an array containing the objects you want to show in the select list
                items: SelectorItems,
                // called whenever an item needs to be displayed.
                elementForItem: indent => {
                    const element = document.createElement("li")
                    element.textContent = indent.text
                    return element
                },
                // called to retrieve a string property on each item and that will be used to filter them.
                filterKeyForItem: indent => {
                    return indent.text
                },
                // called when the user clicks or presses Enter on an item. // use `=>` for `this`
                didConfirmSelection: indent => {
                    const editor = atom.workspace.getActiveTextEditor()
                    if (editor instanceof atom_1.TextEditor) {
                        indent_detective_1.setIndent(editor, indent)
                    }
                    this.modalPanel.hide()
                },
                // called when the user presses Esc or the list loses focus. // use `=>` for `this`
                didCancelSelection: () => {
                    this.modalPanel.hide()
                    return {} // f()!
                }
            })
            // Adding SelectListView to panel
            this.modalPanel = atom.workspace.addModalPanel({
                item: this.indentListView
            })
        } else {
            console.error("First dispose() the object")
        }
    }
    // Show a selector object
    show() {
        // Show selector
        this.indentListView.reset()
        this.modalPanel.show()
        this.indentListView.focus()
    }
    // Dispose selector
    dispose() {
        this.indentListView.destroy()
        this.modalPanel.destroy()
    }
}
exports.Selector = Selector
//# sourceMappingURL=selector.js.map
