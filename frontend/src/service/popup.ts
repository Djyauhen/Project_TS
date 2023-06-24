import {CustomHttp} from "./custom-http.ts";
import config from "../../config/config";
import {CategoriesPage} from "../components/categoriesPage.ts";
import {GetOperations} from "./getOperations.ts";
import {Sidebars} from "./sidebars";

export class Popup {
    constructor(array) {
        const that = this;

        this.openPopup(that, array).then();
    }

    async openPopup(item, array) {
        const urlRoute = window.location.hash.split('?')[0];
        const popup = document.getElementById('popup');
        const agree = document.getElementById('agree');
        const disagree = document.getElementById('disagree');
        const openBtns = document.getElementsByClassName('delete-category');
        const changeBtns = document.getElementsByClassName('edit-category');
        let categoryId = '';
        let categoryTitle = '';


        function closePopup() {
            popup.style.display = 'none';
            categoryId = '';
            categoryTitle = '';
        }

        for (let i = 0; i < openBtns.length; i++) {
            openBtns[i].onclick = function () {
                popup.style.display = 'flex';
                categoryId = array[i].id;
                categoryTitle = array[i].title;

                if (urlRoute === '#/incomes') {
                    agree.onclick = () => {
                        item.deleteOperations(categoryTitle).then(() => deleteInc());
                    }
                }
                if (urlRoute === '#/expenses') {
                    agree.onclick = () => {
                        item.deleteOperations(categoryTitle).then(() => deleteExp());
                    };
                }
            };
        }

        for (let i = 0; i < changeBtns.length; i++) {
            changeBtns[i].onclick = function () {
                categoryId = array[i].id;
                categoryTitle = array[i].title;

                if (urlRoute === '#/incomes') {
                    location.href = '#/changeCategory?income/' + categoryId;
                }
                if (urlRoute === '#/expenses') {
                    location.href = '#/changeCategory?expense/' + categoryId;
                }
            };
        }


        disagree.addEventListener("click", closePopup);

        function deleteExp() {
            item.deleteCategory('/categories/expense/' + categoryId)
                .then(() => closePopup())
                .then(() => new CategoriesPage())
        }

        function deleteInc() {
            item.deleteCategory('/categories/income/' + categoryId)
                .then(() => closePopup())
                .then(() => new CategoriesPage())
        }

    }

    async deleteCategory(urlRoute) {

        try {
            const result = await CustomHttp.request(config.host + urlRoute, 'DELETE');

            if (result) {
                if (!result) {
                    throw new Error(result.message);
                }
            }
        } catch (error) {
            return console.log(error);
        }
    }

    async deleteOperations(categoryTitle) {
        let operations = await new GetOperations('all');
        const deleteCategory = operations.filter(operation => operation.category === categoryTitle);

        deleteCategory.forEach(item => a(item.id));

        async function a(id) {
            try {
                const result = await CustomHttp.request(config.host + '/operations/' + id, 'DELETE');
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
    }
}



