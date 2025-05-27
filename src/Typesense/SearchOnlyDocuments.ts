import RequestWithCache from "./RequestWithCache";
import ApiCall from "./ApiCall";
import Configuration from "./Configuration";
import Collections from "./Collections";
import type {
  DocumentSchema,
  SearchOptions,
  SearchParamsWithPreset,
  SearchResponse,
} from "./Documents";
import { normalizeArrayableParams } from "./Utils";
import { SearchableDocuments, SearchParams } from "./Types";
import axios from "axios";

const RESOURCEPATH = "/documents";

export class SearchOnlyDocuments<T extends DocumentSchema>
  implements SearchableDocuments<T>
{
  protected requestWithCache: RequestWithCache = new RequestWithCache();

  constructor(
    protected collectionName: string,
    protected apiCall: ApiCall,
    protected configuration: Configuration,
  ) {}

  clearCache() {
    this.requestWithCache.clearCache();
  }

  protected async makeApiRequest<T>(query: string): Promise<T> {
    try {
      console.log(
        "[Typesense] Making API request to Lambda with query:",
        query,
      );
      const response = await axios.post<T>(
        "https://arhhm5omsof3nkzctfctb5fcl40wdiya.lambda-url.eu-central-1.on.aws",
        {
          text: query,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 5000, // 5 second timeout for production
        },
      );
      console.log("[Typesense] API response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("[Typesense] API request failed:", error.message);
      throw error;
    }
  }

  protected async interceptSearchQuery(query: string): Promise<string> {
    try {
      console.log("[Typesense] Intercepting query:", query);

      // Skip processing for very short queries or empty queries
      if (!query || query.trim().length < 2) {
        console.log("[Typesense] Skipping processing for short query");
        return query;
      }

      const response = await this.makeApiRequest<{
        processed: string;
        original: string;
      }>(query);
      const processedQuery = response.processed ?? query;
      console.log("[Typesense] Using processed query:", processedQuery);
      return processedQuery;
    } catch (error: any) {
      // Production-ready fallback: always return original query on error
      console.error(
        "[Typesense] Error processing query, using original:",
        error.message,
      );
      return query;
    }
  }

  async search(
    searchParameters: SearchParams<T> | SearchParamsWithPreset<T>,
    {
      cacheSearchResultsForSeconds = this.configuration
        .cacheSearchResultsForSeconds,
      abortSignal = null,
    }: SearchOptions = {},
  ): Promise<SearchResponse<T>> {
    const additionalQueryParams = {};
    if (this.configuration.useServerSideSearchCache === true) {
      additionalQueryParams["use_cache"] = true;
    }

    // Intercept and modify the query if it exists
    if (searchParameters.q) {
      const originalQuery = searchParameters.q;
      searchParameters.q = await this.interceptSearchQuery(searchParameters.q);
      console.log(
        `[Typesense] Query transformation: "${originalQuery}" → "${searchParameters.q}"`,
      );
    }

    const { streamConfig, ...rest } = normalizeArrayableParams<
      T,
      SearchParams<T>
    >(searchParameters);

    const queryParams = {
      ...additionalQueryParams,
      ...rest,
    };

    console.log(
      "[Typesense] Final search parameters being sent to Typesense:",
      queryParams,
    );

    const isStreamingRequest = queryParams.conversation_stream === true;

    return this.requestWithCache.perform<
      ApiCall,
      "get",
      [T],
      SearchResponse<T>
    >(
      this.apiCall,
      "get",
      {
        path: this.endpointPath("search"),
        queryParams,
        streamConfig,
        abortSignal,
        isStreamingRequest,
      },
      {
        cacheResponseForSeconds: cacheSearchResultsForSeconds,
      },
    );
  }

  protected endpointPath(operation?: string) {
    return `${Collections.RESOURCEPATH}/${encodeURIComponent(this.collectionName)}${RESOURCEPATH}${
      operation === undefined ? "" : "/" + operation
    }`;
  }

  static get RESOURCEPATH() {
    return RESOURCEPATH;
  }
}
