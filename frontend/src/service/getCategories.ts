import {CustomHttp} from "./custom-http";
import config from "../../config/config";
import {CategoriesResponseType} from "../types/categories-response.type";

export class GetCategories {
    constructor(typeCategory: string) {
        this.categories(typeCategory);
    }

    async categories(typeCategory: string): Promise<CategoriesResponseType[]> {
        return await CustomHttp.request(config.host + '/categories/' + typeCategory);
    }
}