import RequestWithCache from "./RequestWithCache";
import ApiCall from "./ApiCall";
import Configuration from "./Configuration";
import type { DocumentSchema, SearchOptions, SearchParamsWithPreset, SearchResponse } from "./Documents";
import { SearchableDocuments, SearchParams } from "./Types";
export declare class SearchOnlyDocuments<T extends DocumentSchema> implements SearchableDocuments<T> {
    protected collectionName: string;
    protected apiCall: ApiCall;
    protected configuration: Configuration;
    protected requestWithCache: RequestWithCache;
    constructor(collectionName: string, apiCall: ApiCall, configuration: Configuration);
    clearCache(): void;
    protected makeApiRequest<T>(query: string): Promise<T>;
    protected interceptSearchQuery(query: string): Promise<string>;
    search(searchParameters: SearchParams<T> | SearchParamsWithPreset<T>, { cacheSearchResultsForSeconds, abortSignal, }?: SearchOptions): Promise<SearchResponse<T>>;
    protected endpointPath(operation?: string): string;
    static get RESOURCEPATH(): string;
}
