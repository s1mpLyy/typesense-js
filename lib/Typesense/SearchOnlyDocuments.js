"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchOnlyDocuments = void 0;
var tslib_1 = require("tslib");
var RequestWithCache_1 = tslib_1.__importDefault(require("./RequestWithCache"));
var Collections_1 = tslib_1.__importDefault(require("./Collections"));
var Utils_1 = require("./Utils");
var axios_1 = tslib_1.__importDefault(require("axios"));
var RESOURCEPATH = "/documents";
var SearchOnlyDocuments = /** @class */ (function () {
    function SearchOnlyDocuments(collectionName, apiCall, configuration) {
        this.collectionName = collectionName;
        this.apiCall = apiCall;
        this.configuration = configuration;
        this.requestWithCache = new RequestWithCache_1.default();
    }
    SearchOnlyDocuments.prototype.clearCache = function () {
        this.requestWithCache.clearCache();
    };
    SearchOnlyDocuments.prototype.makeApiRequest = function (query) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var response, error_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        console.log("[Typesense] Making API request to Lambda with query:", query);
                        return [4 /*yield*/, axios_1.default.post("https://arhhm5omsof3nkzctfctb5fcl40wdiya.lambda-url.eu-central-1.on.aws", {
                                text: query,
                            }, {
                                headers: {
                                    "Content-Type": "application/json",
                                },
                            })];
                    case 1:
                        response = _a.sent();
                        console.log("[Typesense] API response:", response.data);
                        return [2 /*return*/, response.data];
                    case 2:
                        error_1 = _a.sent();
                        console.error("[Typesense] API request failed:", error_1);
                        throw error_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SearchOnlyDocuments.prototype.interceptSearchQuery = function (query) {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var response, processedQuery, error_2;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        console.log("[Typesense] Intercepting query:", query);
                        return [4 /*yield*/, this.makeApiRequest(query)];
                    case 1:
                        response = _b.sent();
                        processedQuery = (_a = response.processed) !== null && _a !== void 0 ? _a : query;
                        console.log("[Typesense] Using processed query:", processedQuery);
                        return [2 /*return*/, processedQuery];
                    case 2:
                        error_2 = _b.sent();
                        // If the API call fails, return the original query
                        console.error("[Typesense] Error processing query, using original:", error_2);
                        return [2 /*return*/, query];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    SearchOnlyDocuments.prototype.search = function (searchParameters, _a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.cacheSearchResultsForSeconds, cacheSearchResultsForSeconds = _c === void 0 ? this.configuration
            .cacheSearchResultsForSeconds : _c, _d = _b.abortSignal, abortSignal = _d === void 0 ? null : _d;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var additionalQueryParams, _e, _f, streamConfig, rest, queryParams, isStreamingRequest;
            return tslib_1.__generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        additionalQueryParams = {};
                        if (this.configuration.useServerSideSearchCache === true) {
                            additionalQueryParams["use_cache"] = true;
                        }
                        if (!searchParameters.q) return [3 /*break*/, 2];
                        _e = searchParameters;
                        return [4 /*yield*/, this.interceptSearchQuery(searchParameters.q)];
                    case 1:
                        _e.q = _g.sent();
                        _g.label = 2;
                    case 2:
                        _f = (0, Utils_1.normalizeArrayableParams)(searchParameters), streamConfig = _f.streamConfig, rest = tslib_1.__rest(_f, ["streamConfig"]);
                        queryParams = tslib_1.__assign(tslib_1.__assign({}, additionalQueryParams), rest);
                        isStreamingRequest = queryParams.conversation_stream === true;
                        return [2 /*return*/, this.requestWithCache.perform(this.apiCall, "get", {
                                path: this.endpointPath("search"),
                                queryParams: queryParams,
                                streamConfig: streamConfig,
                                abortSignal: abortSignal,
                                isStreamingRequest: isStreamingRequest,
                            }, {
                                cacheResponseForSeconds: cacheSearchResultsForSeconds,
                            })];
                }
            });
        });
    };
    SearchOnlyDocuments.prototype.endpointPath = function (operation) {
        return "".concat(Collections_1.default.RESOURCEPATH, "/").concat(encodeURIComponent(this.collectionName)).concat(RESOURCEPATH).concat(operation === undefined ? "" : "/" + operation);
    };
    Object.defineProperty(SearchOnlyDocuments, "RESOURCEPATH", {
        get: function () {
            return RESOURCEPATH;
        },
        enumerable: false,
        configurable: true
    });
    return SearchOnlyDocuments;
}());
exports.SearchOnlyDocuments = SearchOnlyDocuments;
//# sourceMappingURL=SearchOnlyDocuments.js.map