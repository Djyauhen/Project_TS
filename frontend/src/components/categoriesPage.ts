import {GetCategories} from "../service/getCategories";
import {Sidebars} from "../service/sidebars";
import {Popup} from "../service/popup";
import {CategoriesResponseType} from "../types/categories-response.type";

export class CategoriesPage {
    readonly title: HTMLElement | null;
    readonly catTable: HTMLElement | null;

    constructor() {
        this.title = document.getElementById('main-title');
        this.catTable = document.getElementById('categoryTable');
        const urlRoute: string = window.location.hash.split('?')[0];
        if (urlRoute === '#/incomes' && this.title) {
            this.title.innerText = 'Доходы';
            this.createCategoriesTable('income').then(data => new Popup(data));
        }
        if (urlRoute === '#/expenses' && this.title) {
            this.title.innerText = 'Расходы';
            this.createCategoriesTable('expense').then(data => new Popup(data));
        }

        new Sidebars();
    }

    async createCategoriesTable(categories: string): Promise<any> {
        let a: CategoriesResponseType[] | null = await new GetCategories(categories).categories(categories);
        let tableCat: string = '';
        const createCat: string = `<div class="category-item add-category-item" id="add-category-item">+</div>`
        if (a) {
            a.forEach((a: CategoriesResponseType)  => {
                const categoryHTML: string = `<div class="category-item" id="categoryItem">
                                            <div class = "category-item-name" id="categoryItemName">${a.title}</div>
                                            <div class="category-item-action">
                                                 <button class="btn edit-category">Редактировать</button>
                                                 <button class="btn delete-category">Удалить</button>
                                            </div>
                                      </div>`;


                tableCat += categoryHTML;
            })
            if (this.catTable) this.catTable.innerHTML = tableCat + createCat;
            this.changePage(categories);
            return a;
        }
    }

    changePage(categories: string): void {
        const createBtn: HTMLElement | null = document.getElementById('add-category-item');

        if (categories === 'income' && createBtn) {
            createBtn.onclick = () => location.href = "#/createCategory?income";
        }
        if (categories === 'expense' && createBtn) {
            createBtn.onclick = () => location.href = "#/createCategory?expense";
        }
    }
}
