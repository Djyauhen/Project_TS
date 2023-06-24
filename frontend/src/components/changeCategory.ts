import {CustomHttp} from "../service/custom-http";
import config from "../../config/config";
import {GetCategories} from "../service/getCategories";
import {CategoriesResponseType} from "../types/categories-response.type";
import {DefaultResponseType} from "../types/default-response.type";
import {CategoryUpdateResponseType} from "../types/category-update-response.type";

export class ChangeCategory {
    title: HTMLElement | null;

    constructor() {
        this.title = document.getElementById('main-header');
        const urlRoute: string = window.location.hash.split('?')[1].split('/')[0];
        const categoryId: number = Number(window.location.hash.split('?')[1].split('/')[1]);
        const agreeBtn: HTMLElement | null = document.getElementById('agree');
        const disagreeBtn: HTMLElement | null = document.getElementById('disagree');
        const that = this;


        if (urlRoute === 'income' && this.title && agreeBtn && disagreeBtn) {
            this.loadCategory('income', categoryId).then();
            this.title.innerText = 'Редактирование категории доходов';
            agreeBtn.onclick = changeInc;
            disagreeBtn.onclick = () => {
                location.href = '#/incomes'
            }
        }
        if (urlRoute === 'expense' && this.title && agreeBtn && disagreeBtn) {
            this.loadCategory('expense', categoryId).then();
            this.title.innerText = 'Редактирование категории расходов';
            agreeBtn.onclick = changeExp;
            disagreeBtn.onclick = () => {
                location.href = '#/expenses'
            }
        }

        function changeExp(): void {
            that.changeCategory('/categories/expense/' + categoryId).then(() => {
                location.href = '#/expenses'
            })
        }

        function changeInc(): void {
            that.changeCategory('/categories/income/' + categoryId).then(() => {
                location.href = '#/incomes'
            })
        }
    }

    async loadCategory(typeCategory: string, categoryId: number): Promise<void> {
        const categoryName: HTMLElement | null = document.getElementById('name');
        const categories: CategoriesResponseType[] = await new GetCategories(typeCategory).categories(typeCategory);
        let category: CategoriesResponseType | undefined = categories.find((item: CategoriesResponseType) => item.id === categoryId);
        if (category && categoryName) {
            categoryName.setAttribute("value", category.title);
        }
    }

    async changeCategory(urlRoute: string): Promise<void> {
        const categoryNameElement: HTMLElement | null = document.getElementById('name');
        if (categoryNameElement) {
            const categoryName: string | null = categoryNameElement.getAttribute("value");
            try {
                if (categoryName) {
                    const result: DefaultResponseType | CategoryUpdateResponseType = await CustomHttp.request(config.host + urlRoute, 'PUT', {
                        title: categoryName
                    });
                    if (result) {
                        if ((result as DefaultResponseType).error !== undefined) {
                            throw new Error((result as DefaultResponseType).message);
                        }
                    }
                }
            } catch (error) {
                return console.log(error);
            }
        }
    }
}