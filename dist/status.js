"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class IndentStatusItem {
    constructor() {
        return this.createView();
    }
    consumeStatusBar(bar) {
        this.bar = bar;
        return this.tile = this.bar.addRightTile({
            item: this.view,
            priority: 10.5
        });
    }
    createView() {
        this.view = document.createElement('span');
        this.view.classList.add('indent-status', 'inline-block');
        this.text = document.createElement('a');
        this.text.innerText = "Spaces (2)";
        this.view.appendChild(this.text);
        this.view.onclick = function () {
            let editor = atom.workspace.getActiveTextEditor();
            if (editor) {
                atom.commands.dispatch(atom.views.getView(editor), 'indent-detective:choose-indent');
            }
        };
        this.updateDisplay(atom.workspace.getActiveTextEditor());
        return this;
    }
    updateDisplay(editor) {
        if (editor) {
            this.view.style.display = "";
            return this.updateText(editor);
        }
        else {
            this.view.style.display = "none";
            return this.clearText();
        }
    }
    updateText(editor) {
        let text;
        if (editor.getSoftTabs()) {
            text = `Spaces (${editor.getTabLength()})`;
        }
        else {
            text = "Tabs";
        }
        return (this.text != null ? this.text.innerText = text : undefined);
    }
    clearText() {
        return (this.text != null ? this.text.innerText = "" : undefined);
    }
    destroy() {
        return (this.tile != null ? this.tile.destroy() : undefined);
    }
}
exports.IndentStatusItem = IndentStatusItem;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdHVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vbGliL3N0YXR1cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUdBLE1BQWEsZ0JBQWdCO0lBT3pCO1FBQ0ksT0FBTyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUE7SUFDNUIsQ0FBQztJQUdELGdCQUFnQixDQUFDLEdBQWM7UUFDM0IsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUE7UUFDZCxPQUFPLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUM7WUFDckMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO1lBQ2YsUUFBUSxFQUFFLElBQUk7U0FDakIsQ0FBQyxDQUFBO0lBQ04sQ0FBQztJQUdELFVBQVU7UUFDTixJQUFJLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUE7UUFDMUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGVBQWUsRUFBRSxjQUFjLENBQUMsQ0FBQTtRQUN4RCxJQUFJLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUE7UUFDdkMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsWUFBWSxDQUFBO1FBQ2xDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUVoQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sR0FBRztZQUNoQixJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFtQixFQUFFLENBQUE7WUFDakQsSUFBSSxNQUFNLEVBQUU7Z0JBQ1IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsZ0NBQWdDLENBQUMsQ0FBQTthQUN2RjtRQUNMLENBQUMsQ0FBQTtRQUdELElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLENBQUE7UUFFeEQsT0FBTyxJQUFJLENBQUE7SUFDZixDQUFDO0lBR0QsYUFBYSxDQUFDLE1BQStCO1FBQ3pDLElBQUksTUFBTSxFQUFFO1lBQ1IsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQTtZQUM1QixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUE7U0FDakM7YUFBTTtZQUNILElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUE7WUFDaEMsT0FBTyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUE7U0FDMUI7SUFDTCxDQUFDO0lBR0QsVUFBVSxDQUFDLE1BQWtCO1FBQ3pCLElBQUksSUFBSSxDQUFBO1FBQ1IsSUFBSSxNQUFNLENBQUMsV0FBVyxFQUFFLEVBQUU7WUFDdEIsSUFBSSxHQUFHLFdBQVcsTUFBTSxDQUFDLFlBQVksRUFBRSxHQUFHLENBQUE7U0FDN0M7YUFBTTtZQUNILElBQUksR0FBRyxNQUFNLENBQUE7U0FDaEI7UUFDRCxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUE7SUFDdkUsQ0FBQztJQUdELFNBQVM7UUFDTCxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUE7SUFDckUsQ0FBQztJQUdELE9BQU87UUFDSCxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFBO0lBQ2hFLENBQUM7Q0FDSjtBQXhFRCw0Q0F3RUMifQ==