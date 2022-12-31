// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  API_URL_BASE: 'https://localhost:5001/api',
  API_ENDPOINT_PRODUCTS: 'products',
  API_ENDPOINT_PRODUCTS_BRANDS: 'brands',
  API_ENDPOINT_PRODUCTS_TYPES: 'types',
  API_QUERY_PAGESIZE_50: 'pageSize=50', // placeholder until params are added

  API_QUERY_DEFAULT_PAGESIZE: 50,
  API_QUERY_KEY_PAGENUMBER: 'pageIndex',
  API_QUERY_KEY_PAGESIZE: 'pageSize',
  API_QUERY_KEY_BRAND_ID: 'brandId',
  API_QUERY_KEY_TYPE_ID: 'typeId',
  API_QUERY_KEY_SEARCH: 'search',
  API_QUERY_KEY_SORT: 'sort'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error',  // Included with Angular CLI.
