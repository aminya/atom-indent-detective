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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9saWIvc2VsZWN0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSwrREFBc0Q7QUFFdEQsa0JBQWU7SUFDYixJQUFJLENBQUMsRUFBb0QsRUFBRSxDQUFDO1FBQzFELElBQUksSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLEVBQUU7WUFBRSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUkscUNBQWMsQ0FBQztTQUFFO1FBQ2xFLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzNCLElBQUksQ0FBQyxRQUFRLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztRQUNwQyxJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksR0FBRyxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUM7UUFDMUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLEVBQUU7WUFDakMsT0FBTyxPQUFPLElBQUksQ0FBQyxJQUFJLE9BQU8sQ0FBQztRQUNqQyxDQUFDLENBQUM7UUFFRixJQUFJLEVBQUUsQ0FBQyxXQUFXLEtBQUssT0FBTyxFQUFFO1lBQzlCLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQ3ZDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUU7Z0JBQ1gsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNwQyxDQUFDLENBQUMsQ0FBQztTQUNKO2FBQU07WUFDTCxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUM1QjtRQUVELE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLEVBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUMsQ0FBQyxDQUFDO1FBQ2xFLElBQUksQ0FBQyxRQUFRLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztRQUVsQyxJQUFJLFNBQVMsR0FBRyxLQUFLLENBQUM7UUFDdEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLEVBQUU7WUFDL0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ1IsU0FBUyxHQUFHLElBQUksQ0FBQztZQUNqQixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDaEMsQ0FBQyxDQUFDO1FBQ0YsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsR0FBRyxHQUFHLEVBQUU7WUFDcEMsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ2hCLElBQUksQ0FBQyxTQUFTLEVBQUU7Z0JBQUUsT0FBTyxDQUFDLEVBQUUsQ0FBQzthQUFFO1FBQ2pDLENBQUMsQ0FBQztJQUNKLENBQUM7Q0FDRixDQUFDIn0=