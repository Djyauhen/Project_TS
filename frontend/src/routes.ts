import {Form} from "./components/form";
import {Main} from "./components/main";
import {Auth} from "./service/auth";
import {CategoriesPage} from "./components/categoriesPage";
import {CreateCategory} from "./components/createCategory";
import {ChangeCategory} from "./components/changeCategory";
import {Operations} from "./components/operations";
import {CreateOperation} from "./components/createOperation";
import {ChangeOperation} from "./components/changeOperation";
import {RoutesType} from "./types/routes.type";

export class Router {
    readonly contentElement: HTMLElement | null;
    readonly stylesElementOne: HTMLElement | null;
    readonly stylesElementTwo: HTMLElement | null;
    readonly titleElement: HTMLElement | null;
    private routes: RoutesType[]

    constructor() {
        this.contentElement = document.getElementById('content');
        this.stylesElementOne = document.getElementById('stylesOne');
        this.stylesElementTwo = document.getElementById('stylesTwo');
        this.titleElement = document.getElementById('titleUp');


        this.routes = [
            {
                route: '#/',
                title: 'Вход',
                template: 'templates/login.html',
                styleOne: 'styles/login.css',
                styleTwo: '',
                load: () => {
                    new Form('login');
                }
            },
            {
                route: '#/signup',
                title: 'Регистрация',
                template: 'templates/signup.html',
                styleOne: 'styles/login.css',
                styleTwo: '',
                load: () => {
                    new Form('signup');
                }
            },

            {
                route: '#/main',
                title: 'Главная',
                template: 'templates/main.html',
                styleOne: 'styles/generalStyle.css',
                styleTwo: 'styles/main.css',
                load: () => {
                    new Main();
                }
            },

            {
                route: '#/operations',
                title: 'Доходы & Расходы',
                template: 'templates/operations.html',
                styleOne: 'styles/generalStyle.css',
                styleTwo: 'styles/main.css',
                load: () => {
                    new Operations();
                }
            },
            {
                route: '#/incomes',
                title: 'Доходы',
                template: 'templates/categories.html',
                styleOne: 'styles/generalStyle.css',
                styleTwo: 'styles/categories.css',
                load: () => {
                    new CategoriesPage();
                }
            },
            {
                route: '#/expenses',
                title: 'Расходы',
                template: 'templates/categories.html',
                styleOne: 'styles/generalStyle.css',
                styleTwo: 'styles/categories.css',
                load: () => {
                    new CategoriesPage();
                }
            },
            {
                route: '#/createCategory',
                title: 'Создать категорию расходов',
                template: 'templates/createCat.html',
                styleOne: 'styles/generalStyle.css',
                styleTwo: 'styles/categories.css',
                load: () => {
                    new CreateCategory();
                }
            },
            {
                route: '#/changeCategory',
                title: 'Создать категорию расходов',
                template: 'templates/changeCategory.html',
                styleOne: 'styles/generalStyle.css',
                styleTwo: 'styles/categories.css',
                load: () => {
                    new ChangeCategory();
                }
            },
            {
                route: '#/createOperation',
                title: 'Создание дохода/расхода',
                template: 'templates/createOperation.html',
                styleOne: 'styles/generalStyle.css',
                styleTwo: 'styles/categories.css',
                load: () => {
                    new CreateOperation();
                }
            },
            {
                route: '#/changeOperation',
                title: 'Редактирование дохода/расхода',
                template: 'templates/createOperation.html',
                styleOne: 'styles/generalStyle.css',
                styleTwo: 'styles/categories.css',
                load: () => {
                    new ChangeOperation();
                }
            },
        ]
    }

    async openRoute(): Promise<void> {
        const urlRoute: string = window.location.hash.split('?')[0];

        if (urlRoute === '#/logout') {
            await Auth.logout();
            window.location.href = '#/';
            return;
        }


        const newRoute: RoutesType | undefined = this.routes.find(item => {
            return item.route === urlRoute;
        })

        if (!newRoute) {
            window.location.href = '#/';
            return;
        }

        if (this.contentElement) this.contentElement.innerHTML = await fetch(newRoute.template).then(response => response.text());
        if (this.stylesElementOne) this.stylesElementOne.setAttribute('href', newRoute.styleOne);
        if (this.stylesElementTwo)  this.stylesElementTwo.setAttribute('href', newRoute.styleTwo);
        if (this.titleElement) this.titleElement.innerText = newRoute.title;

        newRoute.load();
    }
}