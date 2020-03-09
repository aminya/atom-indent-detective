"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const atom_select_list_1 = require("atom-select-list");
const atom_1 = require("atom");
const indent_detective_1 = require("./indent-detective");
function selector_show(subs) {
    let makeModalPanel = true;
    let modalPanel;
    let indentListView;
    if (makeModalPanel) {
        indentListView = new atom_select_list_1.SelectListView({
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9saWIvc2VsZWN0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSx1REFBZ0Q7QUFFaEQsK0JBQXdFO0FBQ3hFLHlEQUEwRTtBQUMxRSxTQUFnQixhQUFhLENBQUMsSUFBeUI7SUFHbkQsSUFBSSxjQUFjLEdBQVksSUFBSSxDQUFBO0lBQ2xDLElBQUksVUFBaUIsQ0FBQTtJQUNyQixJQUFJLGNBQThCLENBQUE7SUFFbEMsSUFBSSxjQUFjLEVBQUU7UUFHaEIsY0FBYyxHQUFHLElBQUksaUNBQWMsQ0FBQztZQUdoQyxLQUFLLEVBQUUsK0JBQVksRUFBRTtZQUdyQixjQUFjLEVBQUUsVUFBVSxNQUFxQjtnQkFDM0MsTUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDN0MsT0FBTyxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDO2dCQUNsQyxPQUFPLE9BQU8sQ0FBQztZQUNuQixDQUFDO1lBR0QsZ0JBQWdCLEVBQUUsVUFBVSxNQUFxQjtnQkFDN0MsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFBO1lBQ3RCLENBQUM7WUFHRCxtQkFBbUIsRUFBRSxVQUFVLE1BQXFCO2dCQUVoRCxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFtQixFQUFFLENBQUM7Z0JBQ3BELElBQUksTUFBTSxZQUFZLGlCQUFVLEVBQUU7b0JBQzlCLDRCQUFTLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO2lCQUM3QjtnQkFDRCxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDdEIsQ0FBQztZQUdELGtCQUFrQixFQUFFO2dCQUNoQixVQUFVLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ2xCLE9BQU8sRUFBRSxDQUFBO1lBQ2IsQ0FBQztTQUNKLENBQUMsQ0FBQztRQUdILFVBQVUsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQztZQUN0QyxJQUFJLEVBQUUsY0FBYztTQUN2QixDQUFDLENBQUM7UUFHSCxJQUFJLENBQUMsR0FBRyxDQUNKLElBQUksaUJBQVUsQ0FBQztZQUNYLGNBQWMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUN6QixVQUFVLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDckIsY0FBYyxHQUFHLElBQUksQ0FBQztRQUMxQixDQUFDLENBQUMsQ0FDTCxDQUFDO1FBR0YsY0FBYyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ3ZCLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNsQixjQUFjLENBQUMsS0FBSyxFQUFFLENBQUM7S0FDMUI7QUFDTCxDQUFDO0FBL0RELHNDQStEQyJ9