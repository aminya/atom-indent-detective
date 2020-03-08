"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const atom_space_pen_views_1 = require("atom-space-pen-views");
exports.default = {
    show(xs, f) {
        if (this.selector == null) {
            this.selector = new atom_space_pen_views_1.SelectListView;
        }
        this.selector.setItems([]);
        this.selector.storeFocusedElement();
        this.selector.getFilterKey = () => 'text';
        this.selector.viewForItem = item => {
            return `<li>${item.text}</li>`;
        };
        if (xs.constructor === Promise) {
            this.selector.setLoading("Loading...");
            xs.then(xs => {
                return this.selector.setItems(xs);
            });
        }
        else {
            this.selector.setItems(xs);
        }
        const panel = atom.workspace.addModalPanel({ item: this.selector });
        this.selector.focusFilterEditor();
        let confirmed = false;
        this.selector.confirmed = item => {
            f(item);
            confirmed = true;
            return this.selector.cancel();
        };
        return this.selector.cancelled = () => {
            panel.destroy();
            if (!confirmed) {
                return f();
            }
        };
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9saWIvc2VsZWN0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwrREFBc0Q7QUFJdEQsa0JBQWU7SUFDYixJQUFJLENBQUMsRUFBRSxFQUFFLENBQUM7UUFDUixJQUFJLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxFQUFFO1lBQUUsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLHFDQUFjLENBQUM7U0FBRTtRQUNsRSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUMzQixJQUFJLENBQUMsUUFBUSxDQUFDLG1CQUFtQixFQUFFLENBQUM7UUFDcEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxZQUFZLEdBQUcsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDO1FBQzFDLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxFQUFFO1lBQ2pDLE9BQU8sT0FBTyxJQUFJLENBQUMsSUFBSSxPQUFPLENBQUM7UUFDakMsQ0FBQyxDQUFDO1FBRUYsSUFBSSxFQUFFLENBQUMsV0FBVyxLQUFLLE9BQU8sRUFBRTtZQUM5QixJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUN2QyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFO2dCQUNYLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDcEMsQ0FBQyxDQUFDLENBQUM7U0FDSjthQUFNO1lBQ0wsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDNUI7UUFFRCxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxFQUFDLElBQUksRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFDLENBQUMsQ0FBQztRQUNsRSxJQUFJLENBQUMsUUFBUSxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFFbEMsSUFBSSxTQUFTLEdBQUcsS0FBSyxDQUFDO1FBQ3RCLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxFQUFFO1lBQy9CLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNSLFNBQVMsR0FBRyxJQUFJLENBQUM7WUFDakIsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2hDLENBQUMsQ0FBQztRQUNGLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEdBQUcsR0FBRyxFQUFFO1lBQ3BDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNoQixJQUFJLENBQUMsU0FBUyxFQUFFO2dCQUFFLE9BQU8sQ0FBQyxFQUFFLENBQUM7YUFBRTtRQUNqQyxDQUFDLENBQUM7SUFDSixDQUFDO0NBQ0YsQ0FBQyJ9