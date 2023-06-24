import {CustomHttp} from "./custom-http.ts";
import config from "../../config/config";
import moment from "moment/moment";

export class GetOperations {
    constructor(period, from, to) {
      return this.getAllOperations(period, from, to);
    }


    async getAllOperations(period, from, to) {
        let dateFrom = moment(from).format('YYYY-MM-DD');
        let dateTo = moment(to).format('YYYY-MM-DD');
        let operations = await this.getOperations('period=' + period + '&dateFrom=' + dateFrom + '&dateTo=' + dateTo);
        if (operations) return operations;
    }

    async getOperations(date) {
        return await CustomHttp.request(config.host + '/operations?' + date);
    }
}