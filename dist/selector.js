"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SelectListView = require('atom-select-list');
const atom_1 = require("atom");
const indent_detective_1 = require("./indent-detective");
function selector_show(subs) {
    let makeModalPanel = true;
    let modalPanel;
    let indentListView;
    if (makeModalPanel) {
        indentListView = new SelectListView({
            items: indent_detective_1.getItemsList(),
            elementForItem: function (indent) {
                const element = document.createElement('li');
                element.textContent = indent.text;
                return element;
            },
            filterKeyForItem: function (indent) {
                return indent.text;
            },
            didConfirmSelection: function (indent) {
                const editor = atom.workspace.getActiveTextEditor();
                if (editor instanceof atom_1.TextEditor) {
                    indent_detective_1.setIndent(editor, indent);
                }
                modalPanel.hide();
            },
            didCancelSelection: function () {
                modalPanel.hide();
                return {};
            },
        });
        modalPanel = atom.workspace.addModalPanel({
            item: indentListView
        });
        subs.add(new atom_1.Disposable(function () {
            indentListView.destroy();
            modalPanel.destroy();
            makeModalPanel = true;
        }));
        indentListView.reset();
        modalPanel.show();
        indentListView.focus();
    }
}
exports.selector_show = selector_show;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9saWIvc2VsZWN0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSxNQUFNLGNBQWMsR0FBRyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQTtBQU9sRCwrQkFBdUU7QUFDdkUseURBQXlFO0FBR3pFLFNBQWdCLGFBQWEsQ0FBQyxJQUF5QjtJQUVuRCxJQUFJLGNBQWMsR0FBWSxJQUFJLENBQUE7SUFDbEMsSUFBSSxVQUFpQixDQUFBO0lBQ3JCLElBQUksY0FBYyxDQUFBO0lBRWxCLElBQUksY0FBYyxFQUFFO1FBR2hCLGNBQWMsR0FBRyxJQUFJLGNBQWMsQ0FBQztZQUdoQyxLQUFLLEVBQUUsK0JBQVksRUFBRTtZQUdyQixjQUFjLEVBQUUsVUFBVSxNQUFxQjtnQkFDM0MsTUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQTtnQkFDNUMsT0FBTyxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFBO2dCQUNqQyxPQUFPLE9BQU8sQ0FBQTtZQUNsQixDQUFDO1lBR0QsZ0JBQWdCLEVBQUUsVUFBVSxNQUFxQjtnQkFDN0MsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFBO1lBQ3RCLENBQUM7WUFHRCxtQkFBbUIsRUFBRSxVQUFVLE1BQXFCO2dCQUVoRCxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFtQixFQUFFLENBQUE7Z0JBQ25ELElBQUksTUFBTSxZQUFZLGlCQUFVLEVBQUU7b0JBQzlCLDRCQUFTLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFBO2lCQUM1QjtnQkFDRCxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUE7WUFDckIsQ0FBQztZQUdELGtCQUFrQixFQUFFO2dCQUNoQixVQUFVLENBQUMsSUFBSSxFQUFFLENBQUE7Z0JBQ2pCLE9BQU8sRUFBRSxDQUFBO1lBQ2IsQ0FBQztTQUNKLENBQUMsQ0FBQTtRQUdGLFVBQVUsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQztZQUN0QyxJQUFJLEVBQUUsY0FBYztTQUN2QixDQUFDLENBQUE7UUFHRixJQUFJLENBQUMsR0FBRyxDQUNKLElBQUksaUJBQVUsQ0FBQztZQUNYLGNBQWMsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtZQUN4QixVQUFVLENBQUMsT0FBTyxFQUFFLENBQUE7WUFDcEIsY0FBYyxHQUFHLElBQUksQ0FBQTtRQUN6QixDQUFDLENBQUMsQ0FDTCxDQUFBO1FBR0QsY0FBYyxDQUFDLEtBQUssRUFBRSxDQUFBO1FBQ3RCLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtRQUNqQixjQUFjLENBQUMsS0FBSyxFQUFFLENBQUE7S0FDekI7QUFDTCxDQUFDO0FBOURELHNDQThEQyJ9