import {Sidebars} from "../service/sidebars";
import {Chart} from "chart.js/auto";
import {Filters} from "../service/filters";
import moment from "moment";

export class Main {
    constructor() {
        const today: HTMLElement | null = document.getElementById('today');
        const week: HTMLElement | null = document.getElementById('week');
        const month: HTMLElement | null = document.getElementById('month');
        const year: HTMLElement | null = document.getElementById('year');
        const all: HTMLElement | null = document.getElementById('all');
        const interval: HTMLElement | null = document.getElementById('interval');
        const allBtns: HTMLCollectionOf<Element> = document.getElementsByClassName('filter-btn');

        function delClass(btn) {
            for (let i = 0; i < allBtns.length; i++) {
                if (allBtns[i].classList.contains('active')) {
                    allBtns[i].classList.remove("active");
                }
            }
            btn.classList.add('active');
        }

        delClass(today);
        this.clickBtn(this,'today').then();

        if (today) today.onclick = () => {
            delClass(today);
            this.clickBtn(this,'today').then()
        };
        if (week) week.onclick = () => {
            delClass(week);
            this.clickBtn(this, 'week').then()
        };
        if (month) month.onclick = () => {
            delClass(month);
            this.clickBtn(this, 'month').then()
        };
        if (year) year.onclick = () => {
            delClass(year);
            this.clickBtn(this, 'year').then();
        };
        if (all) all.onclick = () => {
            delClass(all);
            this.clickBtn(this, 'all').then()
        };
        if (interval) interval.onclick = () => {
            delClass(interval);
            let from = (document.getElementById('dateFrom') typeof HTMLInputElement).value;
            let dateFrom = moment(from, true).format('YYYY-MM-DD');
            let to = document.getElementById('dateTo').value;
            let dateTo = moment(to, true).format('YYYY-MM-DD');
            this.clickBtn(this, 'interval', dateFrom, dateTo).then()
        };

        new Sidebars();
    }


    async clickBtn(that, period, from, to) {
        let getData = await new Filters(period, from, to);

        function f1(data) {
            return data
        }

        let [incomesCategories, incomesData, expenseCategories, expensesData] = f1(getData);
        const incomes = document.getElementById('canvasIncomes');
        const expenses = document.getElementById('canvasExpense');

        let expenseChart = document.getElementById('catExpenses');
        let incomesChart = document.getElementById('catIncomes');

        if (incomesChart) {
            incomesChart.remove();
            incomesChart = document.createElement("canvas");
            incomesChart.id = 'catIncomes';
            incomesChart.style.width = '437px';
            incomesChart.style.height = '437px';
        } else {
            incomesChart = document.createElement("canvas");
            incomesChart.id = 'catIncomes';
            incomesChart.style.width = '437px';
            incomesChart.style.height = '437px';
        }

        if (expenseChart) {
            expenseChart.remove();
            expenseChart = document.createElement("canvas");
            expenseChart.id = 'catExpenses';
            expenseChart.style.width = '437px';
            expenseChart.style.height = '437px';
        } else {
            expenseChart = document.createElement("canvas");
            expenseChart.id = 'catExpenses';
            expenseChart.style.width = '437px';
            expenseChart.style.height = '437px';
        }
        incomes.appendChild(incomesChart);
        expenses.appendChild(expenseChart);

        let configIncomes = {
            type: 'pie',
            data: {
                labels: incomesCategories,
                datasets: [{
                    data: incomesData,
                    label: "$",
                    borderWidth: 1
                }]
            },
            options: {
                radius: 180
            }
        }

        let configExpenses = {
            type: 'pie',
            data: {
                labels: expenseCategories,
                datasets: [{
                    data: expensesData,
                    label: "$",
                    borderWidth: 1
                }]
            },
            options: {
                radius: 180
            }
        }

        await new Chart(incomesChart, configIncomes);
        await new Chart(expenseChart, configExpenses);
    }
}




