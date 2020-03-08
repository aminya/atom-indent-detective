"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    activate() {
        return this.createView();
    },
    deactivate() {
        return (this.tile != null ? this.tile.destroy() : undefined);
    },
    consumeStatusBar(bar) {
        this.bar = bar;
        return this.tile = this.bar.addRightTile({
            item: this.view,
            priority: 10.5
        });
    },
    createView() {
        this.view = document.createElement('span');
        this.view.classList.add('indent-status', 'inline-block');
        this.text = document.createElement('a');
        this.text.innerText = "Spaces (2)";
        this.view.appendChild(this.text);
        return this.view.onclick = () => {
            return atom.commands.dispatch(atom.views.getView(atom.workspace.getActiveTextEditor()), 'indent-detective:choose-indent');
        };
    },
    update(editor) {
        if (editor) {
            this.view.style.display = "";
            return this.updateText(editor);
        }
        else {
            this.view.style.display = "none";
            return this.clearText();
        }
    },
    updateText(editor) {
        let text;
        if (editor.getSoftTabs()) {
            text = `Spaces (${editor.getTabLength()})`;
        }
        else {
            text = "Tabs";
        }
        return (this.text != null ? this.text.innerText = text : undefined);
    },
    clearText() {
        return (this.text != null ? this.text.innerText = "" : undefined);
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdHVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vbGliL3N0YXR1cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUdBLGtCQUFlO0lBQ2IsUUFBUTtRQUNOLE9BQU8sSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQzNCLENBQUM7SUFFRCxVQUFVO1FBQ1IsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUMvRCxDQUFDO0lBRUQsZ0JBQWdCLENBQUMsR0FBYztRQUM3QixJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztRQUNmLE9BQU8sSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQztZQUN2QyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7WUFDZixRQUFRLEVBQUUsSUFBSTtTQUNmLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxVQUFVO1FBQ1IsSUFBSSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzNDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsY0FBYyxDQUFDLENBQUM7UUFDekQsSUFBSSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3hDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxHQUFHLFlBQVksQ0FBQztRQUNuQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDakMsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxHQUFHLEVBQUU7WUFDOUIsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFtQixFQUFFLENBQUMsRUFDckYsZ0NBQWdDLENBQUMsQ0FBQztRQUNyQyxDQUFDLENBQUM7SUFDSixDQUFDO0lBRUQsTUFBTSxDQUFDLE1BQW1CO1FBQ3hCLElBQUksTUFBTSxFQUFFO1lBQ1YsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztZQUM3QixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDaEM7YUFBTTtZQUNMLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7WUFDakMsT0FBTyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7U0FDekI7SUFDSCxDQUFDO0lBRUQsVUFBVSxDQUFDLE1BQWtCO1FBQzNCLElBQUksSUFBSSxDQUFDO1FBQ1QsSUFBSSxNQUFNLENBQUMsV0FBVyxFQUFFLEVBQUU7WUFDeEIsSUFBSSxHQUFHLFdBQVcsTUFBTSxDQUFDLFlBQVksRUFBRSxHQUFHLENBQUM7U0FDNUM7YUFBTTtZQUNMLElBQUksR0FBRyxNQUFNLENBQUM7U0FDZjtRQUNELE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUN0RSxDQUFDO0lBRUQsU0FBUztRQUNQLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNwRSxDQUFDO0NBQ0YsQ0FBQyJ9