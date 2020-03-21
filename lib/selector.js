"use strict"
Object.defineProperty(exports, "__esModule", { value: true })
const SelectListView = require("atom-select-list")
// TODO: observe https://github.com/atom/atom-select-list/pull/28/files
// import {SelectListView} from 'atom-select-list'
const atom_1 = require("atom")
const indent_detective_1 = require("./indent-detective")
function selector_show(subs) {
    let makeModalPanel = true
    let modalPanel
    let indentListView
    if (makeModalPanel) {
        // Defining a SelectListView with methods - https://github.com/atom/atom-select-list
        indentListView = new SelectListView({
            // an array containing the objects you want to show in the select list
            items: indent_detective_1.SelectorItems,
            // called whenever an item needs to be displayed.
            elementForItem(indent) {
                const element = document.createElement("li")
                element.textContent = indent.text
                return element
            },
            // called to retrieve a string property on each item and that will be used to filter them.
            filterKeyForItem(indent) {
                return indent.text
            },
            // called when the user clicks or presses Enter on an item.
            didConfirmSelection(indent) {
                const editor = atom.workspace.getActiveTextEditor()
                if (editor instanceof atom_1.TextEditor) {
                    indent_detective_1.setIndent(editor, indent)
                }
                modalPanel.hide()
            },
            // called when the user presses Esc or the list loses focus.
            didCancelSelection() {
                modalPanel.hide()
                return {} // f()!
            }
        })
        // Adding SelectListView to panel
        modalPanel = atom.workspace.addModalPanel({
            item: indentListView
        })
        // Add disposable
        subs.add(
            new atom_1.Disposable(function() {
                indentListView.destroy()
                modalPanel.destroy()
                makeModalPanel = true
            })
        )
        // Show selector
        indentListView.reset()
        modalPanel.show()
        indentListView.focus()
    }
}
exports.selector_show = selector_show
//# sourceMappingURL=selector.js.map
