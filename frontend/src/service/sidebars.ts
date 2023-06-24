import {Auth} from "./auth.ts";
import {CustomHttp} from "./custom-http.ts";
import config from "../../config/config";

export class Sidebars {
    constructor() {
        const dropdownToggle = document.getElementById('dropdown-toggle');
        const dropdownMenu = document.getElementById('dropdown-menu');
        const dropdownBtn = document.getElementById('dropdown-button');
        const mainBtn = document.getElementById('mainBtn');
        const incomesBtn = document.getElementById('catIncomesBtn');
        const expenseBtn = document.getElementById('catExpenseBtn');
        const allBtn = document.getElementsByClassName('nav-link');
        const incExpBtn = document.getElementById('incomesExpenseBtn');
        this.profileNameElement = document.getElementById('userName');
        const img = document.getElementById('user-image');
        const logout = document.getElementById('logout');
        this.balanceProfile = document.getElementById('balance');
        const urlRoute = window.location.hash.split('?')[0];
        const that = this;


        const userInfo = Auth.getUserInfo();
        const accessToken = localStorage.getItem(Auth.accessTokenKey);

        if (userInfo && accessToken) {
            this.profileNameElement.innerText = userInfo.fullName;
        }

        this.getBalance().then(data => {
            that.balanceProfile.innerText = data.balance;
        });

        dropdownMenu.style.display = 'none';
        dropdownBtn.style.transform = 'rotate(-90deg)';
        logout.style.display = 'none';

        if (urlRoute === "#/main") {
            delClass(mainBtn);
        }
        if (urlRoute === "#/operations") {
            delClass(incExpBtn);
        }
        if (urlRoute === "#/incomes") {
            delClass(incomesBtn);
        }
        if (urlRoute === "#/expenses") {
            delClass(expenseBtn);
        }

        function delClass(btn) {
            for (let i = 0; i < allBtn.length; i++) {
                if (allBtn[i].classList.contains('active')) {
                    allBtn[i].classList.remove("active");
                }
            }
            btn.classList.add('active');
            if (btn === incomesBtn || btn === expenseBtn) {
                dropdownToggle.classList.add('active');
                dropdownMenu.style.display = 'flex';
                dropdownBtn.style.transform = 'rotate(0deg)';
            }
        }

        function rollUp() {
            if (dropdownToggle.classList.contains('active')) {
                dropdownToggle.classList.remove('active');
                dropdownMenu.style.display = 'none';
                dropdownBtn.style.transform = 'rotate(-90deg)';
            } else {
                dropdownToggle.classList.add('active');
                dropdownMenu.style.display = 'flex';
                dropdownBtn.style.transform = 'rotate(0deg)';
            }
        }

        mainBtn.onclick = () => {
            location.href = '#/main';
        };

        incExpBtn.onclick = () => {
            location.href = '#/operations';
        };

        incomesBtn.onclick = () => {
            location.href = '#/incomes';
        };
        expenseBtn.onclick = () => {
            location.href = '#/expenses';
        };

        dropdownToggle.onclick = () => {
            rollUp();
        }



        img.onclick = () => {
           if (logout.style.display !== 'flex') {
               logout.style.display = 'flex'
           } else {
               logout.style.display = 'none'
           }
        }

        logout.onclick = () => {
            location.href = '#/logout'
        }
    }

    async getBalance() {
        return await CustomHttp.request(config.host + '/balance');
    }
}