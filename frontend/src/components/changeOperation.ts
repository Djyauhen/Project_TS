import {Sidebars} from "../service/sidebars";
import {CustomHttp} from "../service/custom-http";
import config from "../../config/config";
import moment from "moment/moment";
import {GetCategories} from "../service/getCategories";
import {OperationResponseType} from "../types/operation-response.type";
// import {CategoriesPage} from "./categoriesPage";
import {CategoriesResponseType} from "../types/categories-response.type";
import {DefaultResponseType} from "../types/default-response.type";

export class ChangeOperation {
    constructor() {
        new Sidebars();
        const id: string = window.location.hash.split('?')[1];
        const titleHTML: HTMLElement | null = document.getElementById('main-header');
        const disagree: HTMLElement | null = document.getElementById('disagree');

        if (titleHTML) titleHTML.innerText = 'Редактирование дохода/расхода';

        this.loadOperation(this, id).then();
        if (disagree) disagree.onclick = () => {
            location.href = '#/operations'
        }
    }

    async loadOperation(that: ChangeOperation, id: string): Promise<void> {
        const operation: OperationResponseType = await CustomHttp.request(config.host + '/operations/' + id);

        const type: HTMLInputElement | null = document.getElementById('typeName') as HTMLInputElement;
        const income: HTMLInputElement | null = document.getElementById('income') as HTMLInputElement;
        const expense: HTMLInputElement | null = document.getElementById('expense') as HTMLInputElement;
        const price: HTMLInputElement | null = document.getElementById('price') as HTMLInputElement;
        const date: HTMLInputElement | null = document.getElementById('date') as HTMLInputElement;
        const comment: HTMLInputElement | null = document.getElementById('comment') as HTMLInputElement;
        let categories: CategoriesResponseType[];


        if (operation.type === 'income' && type && income) {
            type.removeAttribute('selected');
            income.setAttribute('selected', 'selected');
        }
        if (operation.type === 'expense' && type && expense) {
            type.removeAttribute('selected');
            expense.setAttribute('selected', 'selected');
        }

        function f1(data: any): any {
            return data;
        }

        if (type && price && date && comment) {
            type.value = operation.type;
            categories = await that.getCat(operation.type, operation).then(f1);
            price.value =  operation.amount.toString();
            date.value =  operation.date;
            comment.value =  operation.comment;
            that.changeOperation(that, operation, categories);
        }
    }

    async changeOperation(that: ChangeOperation, operation: OperationResponseType, categories: CategoriesResponseType[]): Promise<void> {
        const type: HTMLInputElement | null = document.getElementById('type') as HTMLInputElement;
        const category: HTMLInputElement | null = document.getElementById('category') as HTMLInputElement;
        const amount: HTMLInputElement | null = document.getElementById('price') as HTMLInputElement;
        const date: HTMLInputElement | null = document.getElementById('date') as HTMLInputElement;
        const comment: HTMLInputElement | null = document.getElementById('comment') as HTMLInputElement;
        const agree: HTMLElement | null = document.getElementById('agree');

        if (type) type.onchange = async () => {
            if (type.value !== "Тип..") {
                operation.type = type.value;
                categories = await that.getCat(type.value, operation).then(f1);
            }
        };

        function f1(data: any): any {
            return data;
        }

        if (category) category.onchange = () => {
            // operation.categoryId? = categories.find(item => item.title === category.value).id;
            operation.category = category.value;
        }
        if (amount) amount.onchange = () => {
            operation.amount = Number(amount.value);
        };
        if (date) date.onchange = () => {
            operation.date = moment(date.value).format('YYYY-MM-DD');
        };
        if (comment) comment.onchange = () => {
            operation.comment = comment.value;
        };


        async function updateOperation(operation: OperationResponseType): Promise<void> {
            try {
                const result = await CustomHttp.request(config.host + '/operations/' + operation.id, "PUT", {
                    type: operation.type,
                    // category_id: operation.categoryId,
                    amount: operation.amount,
                    date: operation.date,
                    comment: operation.comment
                })
                if (result) {
                    if (!result.user) {
                        new Sidebars();
                        throw new Error((result as DefaultResponseType).message);
                    }
                }
            } catch (error) {
                return console.log(error);
            }
        }

        if (agree) {
            agree.onclick = () => {
                updateOperation(operation);
                location.href = '#/operations';
            }
        }
    }

    async getCat(type: string, operation: OperationResponseType): Promise<CategoriesResponseType[]> {
        const category: HTMLInputElement | null = document.getElementById('category') as HTMLInputElement;
        let options: HTMLOptionElement[] = [];
        const categories: CategoriesResponseType[] = await new GetCategories(type).categories(type);
        if (category) {
            const items: HTMLCollectionOf<HTMLOptionElement> = document.getElementsByTagName('option');
            const newItems: HTMLOptionElement[] = [];
            for (let arr of items) {
                newItems.push(arr);
            }
            const a: HTMLOptionElement[] = newItems.filter((item: HTMLOptionElement) => item.id.includes('option_'));
            a.forEach((item: HTMLOptionElement) => item.remove());
        }
        const optionFirst: HTMLOptionElement | null = document.getElementById('option') as HTMLOptionElement;
        if (optionFirst) optionFirst.removeAttribute('selected');
        categories.forEach((category: CategoriesResponseType) => {
            const option: HTMLOptionElement = document.createElement('option');
            if (category.title === operation.category) {
                option.setAttribute('selected', 'selected');
            }
            option.setAttribute('id', 'option_' + category.id);
            option.setAttribute('value', category.title);
            option.innerText = category.title;
            options.push(option);
        })
        options.forEach((item: HTMLOptionElement) => {
            if (category) category.appendChild(item);
        })
        return categories;
    }
}