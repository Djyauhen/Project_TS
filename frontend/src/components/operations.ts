import {Sidebars} from "../service/sidebars";
import {GetOperations} from "../service/getOperations";
import moment from "moment/moment";
import {CustomHttp} from "../service/custom-http";
import config from "../../config/config";


export class Operations {
    constructor() {
        const createIncome = document.getElementById('create-income');
        const createExpense = document.getElementById('create-expense');

        const today = document.getElementById('today');
        const week = document.getElementById('week');
        const month = document.getElementById('month');
        const year = document.getElementById('year');
        const all = document.getElementById('all');
        const interval = document.getElementById('interval');
        const allBtns = document.getElementsByClassName('filter-btn');
        this.table = document.getElementById('table');

        today.classList.add('active');
        this.buildTable(this).then();

        function delClass(btn) {
            for (let i = 0; i < allBtns.length; i++) {
                if (allBtns[i].classList.contains('active')) {
                    allBtns[i].classList.remove("active");
                }
            }
            btn.classList.add('active');
        }


        today.onclick = () => {
            delClass(today);
            this.buildTable(this, 'today').then()
        };
        week.onclick = () => {
            delClass(week);
            this.buildTable(this, 'week').then()
        };
        month.onclick = () => {
            delClass(month);
            this.buildTable(this, 'month').then()
        };
        year.onclick = () => {
            delClass(year);
            this.buildTable(this, 'year').then()
        };
        all.onclick = () => {
            delClass(all);
            this.buildTable(this, 'all').then()
        };
        interval.onclick = () => {
            delClass(interval);
            let from = document.getElementById('dateFrom').value;
            let dateFrom = moment(from, 'DD.MM.YYYY', true).format('YYYY-MM-DD');
            let to = document.getElementById('dateTo').value;
            let dateTo = moment(to, 'DD.MM.YYYY', true).format('YYYY-MM-DD');
            this.buildTable(this, 'interval', dateFrom, dateTo).then()
        };
        createIncome.onclick = () => {
            location.href = '#/createOperation?income'
        }
        createExpense.onclick = () => {
            location.href = '#/createOperation?expense'
        }
        new Sidebars()
    }

    async deleteOperation(that, operations, period, from, to) {
        operations.forEach(operation => {
            let operationBtn = document.getElementById('delete_' + operation.id);
            operationBtn.onclick = () => popup(operation.id);
        })

        function popup(id) {
            const popup = document.getElementById('popup');
            const agree = document.getElementById('agree');
            const disagree = document.getElementById('disagree');

            popup.style.display = 'flex';
            agree.onclick = () => {
                a(id);
                popup.style.display = 'none';
            };
            disagree.onclick = () => popup.style.display = 'none';
        }

        async function a(id) {
            try {
                const result = await CustomHttp.request(config.host + '/operations/' + id, 'DELETE');

                if (result) {
                    if (!result.user) {
                        that.buildTable(that, period, from, to).then();
                        new Sidebars();
                        throw new Error(result.message);
                    }
                }
            } catch (error) {
                return console.log(error);
            }
        }
    }

    changeOperation(operations) {
        operations.forEach(operation => {
            let operationBtn = document.getElementById('change_' + operation.id);
            operationBtn.onclick = () => {
                location.href = '#/changeOperation?' + operation.id;
            };
        })
    }

    async buildTable(that, period, from, to) {
        let operations = await new GetOperations(period, from, to);
        let tableRows = '';
        let num = 1;
        operations.forEach(operation => {
            let categoryName = '';
            if (operation.type === 'income') {
                categoryName = 'Доход';
            }
            if (operation.type === 'expense') {
                categoryName = 'Расход'
            }
            let date = moment(operation.date).format('DD.MM.YYYY');

            const tableHTML = `<div class="row" id="row">
                                    <div class="col num">${num}</div>
                                    <div class="col type">${categoryName}</div>
                                    <div class="col cat catCol" id="cat">${operation.category}</div>
                                    <div class="col sum">${operation.amount} $</div>
                                    <div class="col date">${date}</div>
                                    <div class="col comm">${operation.comment}</div>
                                    <div class="col twoBtns">
                                        <button class="delete" id="delete_${operation.id}">
                                            <svg width="14" height="15" viewBox="0 0 14 15" fill="none"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                <path d="M4.5 5.5C4.77614 5.5 5 5.72386 5 6V12C5 12.2761 4.77614 12.5 4.5 12.5C4.22386 12.5 4 12.2761 4 12V6C4 5.72386 4.22386 5.5 4.5 5.5Z"
                                                        fill="black"/>
                                                <path d="M7 5.5C7.27614 5.5 7.5 5.72386 7.5 6V12C7.5 12.2761 7.27614 12.5 7 12.5C6.72386 12.5 6.5 12.2761 6.5 12V6C6.5 5.72386 6.72386 5.5 7 5.5Z"
                                                        fill="black"/>
                                                <path d="M10 6C10 5.72386 9.77614 5.5 9.5 5.5C9.22386 5.5 9 5.72386 9 6V12C9 12.2761 9.22386 12.5 9.5 12.5C9.77614 12.5 10 12.2761 10 12V6Z"
                                                        fill="black"/>
                                                <path fill-rule="evenodd" clip-rule="evenodd"
                                                        d="M13.5 3C13.5 3.55228 13.0523 4 12.5 4H12V13C12 14.1046 11.1046 15 10 15H4C2.89543 15 2 14.1046 2 13V4H1.5C0.947715 4 0.5 3.55228 0.5 3V2C0.5 1.44772 0.947715 1 1.5 1H5C5 0.447715 5.44772 0 6 0H8C8.55229 0 9 0.447715 9 1H12.5C13.0523 1 13.5 1.44772 13.5 2V3ZM3.11803 4L3 4.05902V13C3 13.5523 3.44772 14 4 14H10C10.5523 14 11 13.5523 11 13V4.05902L10.882 4H3.11803ZM1.5 3V2H12.5V3H1.5Z"
                                                        fill="black"/>
                                            </svg>
                                        </button>
                                        <button class="change" id="change_${operation.id}">
                                             <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M12.1465 0.146447C12.3417 -0.0488155 12.6583 -0.0488155 12.8536 0.146447L15.8536 3.14645C16.0488 3.34171 16.0488 3.65829 15.8536 3.85355L5.85357 13.8536C5.80569 13.9014 5.74858 13.9391 5.68571 13.9642L0.68571 15.9642C0.500002 16.0385 0.287892 15.995 0.146461 15.8536C0.00502989 15.7121 -0.0385071 15.5 0.0357762 15.3143L2.03578 10.3143C2.06092 10.2514 2.09858 10.1943 2.14646 10.1464L12.1465 0.146447ZM11.2071 2.5L13.5 4.79289L14.7929 3.5L12.5 1.20711L11.2071 2.5ZM12.7929 5.5L10.5 3.20711L4.00001 9.70711V10H4.50001C4.77616 10 5.00001 10.2239 5.00001 10.5V11H5.50001C5.77616 11 6.00001 11.2239 6.00001 11.5V12H6.29291L12.7929 5.5ZM3.03167 10.6755L2.92614 10.781L1.39754 14.6025L5.21903 13.0739L5.32456 12.9683C5.13496 12.8973 5.00001 12.7144 5.00001 12.5V12H4.50001C4.22387 12 4.00001 11.7761 4.00001 11.5V11H3.50001C3.28561 11 3.10272 10.865 3.03167 10.6755Z"
                                                    fill="black"/>
                                            </svg>
                                        </button>
                                    </div>
                                </div>`;
            num++;
            tableRows += tableHTML;
        })
        this.table.innerHTML = tableRows;
        let cat = document.getElementsByClassName('catCol');
        for (let col of cat) {
            let type = col.previousSibling.previousSibling;
            if (type.textContent === 'Доход') {
                type.style.color = 'green';
            }
            if (type.textContent === 'Расход') {
                type.style.color = 'red';
            }
        }

        that.deleteOperation(that, operations, period, from, to);
        that.changeOperation(operations);
    }

}




