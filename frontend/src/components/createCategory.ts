import {CustomHttp} from "../service/custom-http";
import config from "../../config/config";

export class CreateCategory {
    private title: HTMLElement | null;

    constructor() {
        this.title = document.getElementById('main-header');
        const urlRoute: string = window.location.hash.split('?')[1];
        const agreeBtn: HTMLElement | null = document.getElementById('agree');
        const disagreeBtn: HTMLElement | null = document.getElementById('disagree');
        const categoryInput: HTMLInputElement | null = document.getElementById('name') as HTMLInputElement;
        const that = this;
        if (agreeBtn) agreeBtn.setAttribute('disabled', 'disabled');

        if (categoryInput) categoryInput.onchange = () => {
            if (categoryInput.value.trim() && agreeBtn) {
                agreeBtn.removeAttribute('disabled');
            }
        }

        if (urlRoute === 'income' && this.title && agreeBtn && disagreeBtn) {
            this.title.innerText = 'Создание категории доходов';
            agreeBtn.onclick = createInc;
            disagreeBtn.onclick = () => {
                location.href = '#/incomes'
            }
        }
        if (urlRoute === 'expense' && this.title && agreeBtn && disagreeBtn) {
            this.title.innerText = 'Создание категории расходов';
            agreeBtn.onclick = createExp;
            disagreeBtn.onclick = () => {
                location.href = '#/expenses'
            }
        }

        function createExp() {
            that.createCategory('/categories/expense').then(() => {
                location.href = '#/expenses'
            })
        }

        function createInc() {
            that.createCategory('/categories/income').then(() => {
                location.href = '#/incomes'
            })
        }
    }

    async createCategory(urlRoute: string): Promise<void> {
        const categoryElement: HTMLInputElement | null = document.getElementById('name') as HTMLInputElement;
        const categoryName: string | null = categoryElement.value.trim();
        try {
            const result = await CustomHttp.request(config.host + urlRoute, 'POST', {
                title: categoryName
            })

            if (result) {
                if (!result) {
                    throw new Error(result.message);
                }
            }
        } catch (error) {
            return console.log(error);
        }
    }
}