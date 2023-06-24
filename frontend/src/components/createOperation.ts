import {Sidebars} from "../service/sidebars";
import {GetCategories} from "../service/getCategories";
import moment from "moment/moment";
import {CustomHttp} from "../service/custom-http";
import config from "../../config/config";

export class CreateOperation {
    constructor() {
        new Sidebars();

        const titleHTML: HTMLElement | null = document.getElementById('main-header');
        const disagree: HTMLElement | null = document.getElementById('disagree') ;

        if (titleHTML) titleHTML.innerText = 'Создание дохода/расхода';
        if (disagree) disagree.onclick = () => {
            location.href = '#/operations'
        }

        this.createOperation().then();
    }

    async createOperation() {
        let operation = {};
        const type: HTMLInputElement | null = document.getElementById('type') as HTMLInputElement;
        const category: HTMLInputElement | null  = document.getElementById('category') as HTMLInputElement;
        const amount: HTMLInputElement | null  = document.getElementById('price') as HTMLInputElement;
        const date: HTMLInputElement | null  = document.getElementById('date') as HTMLInputElement;
        const comment: HTMLInputElement | null  = document.getElementById('comment') as HTMLInputElement;
        const agree = document.getElementById('agree');
        let categories: GetCategories;
        const urlRoute: string | null = window.location.hash.split('?')[1];

        if (urlRoute === 'income' && type) {
            type.value = 'income';
            operation.type = type.value;
        }
        if (urlRoute === 'expense') {
            type.value = 'expense';
            operation.type = type.value;
        }

        categories = await getCat(type.value).then(f1);

        agree.setAttribute('disabled', 'disabled');

        validation();

        type.onchange = async () => {
            if (type.value !== "Тип..") {
                operation.type = type.value;
                categories = await getCat(type.value).then(f1);
            }
            validation();
        };

        function f1(data) {
            return data;
        }

        async function getCat(type) {
            let options = [];
            const categories = await new GetCategories(type);
            if (category) {
                const items = document.getElementsByTagName('option');
                const newItems = [];
                for (let arr of items) {
                    newItems.push(arr);
                }
                const a = newItems.filter(item => item.id.includes('option_'));
                a.forEach(item => item.remove());
            }
            categories.forEach(item => {
                const option = document.createElement('option');
                option.setAttribute('id', 'option_' + item.id);
                option.setAttribute('value', item.title);
                option.innerText = item.title;
                options.push(option);
            })
            options.forEach(item => {
                category.appendChild(item);
            })
            return categories;
        }

        category.onchange = () => {
            operation.categoryId = categories.find(item => item.title === category.value).id;
            operation.category = category.value;
            validation();
        }
        amount.onchange = () => {
            operation.amount = amount.value;
            validation();
        };
        date.onchange = () => {
            operation.date = moment(date.value).format('YYYY-MM-DD');
            validation();
        };
        comment.onchange = () => {
            operation.comment = comment.value;
            validation();
        };

        function validation() {
            if (operation.type && operation.categoryId && operation.amount && operation.date && operation.comment) {
                agree.removeAttribute('disabled')
            }
        }


        async function createOperation(operation) {
            try {
                const result = await CustomHttp.request(config.host + '/operations', "POST", {
                    type: operation.type,
                    // category_id: operation.categoryId,
                    amount: operation.amount,
                    date: operation.date,
                    comment: operation.comment
                })
                if (result) {
                    if (!result.user) {
                        new Sidebars();
                        throw new Error(result.message);
                    }
                }
            } catch (error) {
                return console.log(error);
            }
        }

        agree.onclick = () => {
            createOperation(operation);
            location.href = '#/operations';
        }
    }
}