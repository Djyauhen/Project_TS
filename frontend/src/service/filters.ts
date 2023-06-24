import {GetOperations} from "./getOperations";

export class Filters {
    constructor(period, from, to) {
        return this.getData(this, period, from, to);
    }

    async getData(that, period, from, to) {
        let operations = await new GetOperations(period, from, to);

        let operationsByCategories = that.getOperationsByCategory(operations);
        let [incomesOperations, expenseOperations] = operationsByCategories;

        let incomesCategories = that.getCategoriseOperations(incomesOperations);

        let expenseCategories = that.getCategoriseOperations(expenseOperations);

        let incomesData = that.getAmountOperations(incomesOperations, incomesCategories);

        let expensesData = that.getAmountOperations(expenseOperations, expenseCategories);

        return [incomesCategories, incomesData, expenseCategories, expensesData]
    }

    getOperationsByCategory(operations) {
        let incomesOperations = [];
        let expenseOperations = [];
        operations.forEach(operation => {
            if (operation.type === 'income') {
                incomesOperations.push(operation);
            }
            if (operation.type === 'expense') {
                expenseOperations.push(operation);
            }
        })
        return [incomesOperations, expenseOperations];
    }

    unique(arr) {
        let result = [];
        for (let str of arr) {
            if (!result.includes(str)) {
                result.push(str);
            }
        }
        return result;
    }

    getCategoriseOperations(operations) {
        return this.unique(operations.map(({category}) => category));
    }

    getAmountOperations(operationsArray, categories) {
        let categoryData = [];
        categories.forEach(category => {
            let array = operationsArray.filter(operation => operation.category === category);
            let operationsAmount = array.map(({amount}) => amount);
            let max = 0;
            for (let sum of operationsAmount) {
                max = max + sum;
            }
            categoryData.push(max);
        })
        return categoryData;
    }

}