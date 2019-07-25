/**
 * Fired to request a search. Its payload is the search term to use.
 */
export const SEARCH_REQUEST_EVENT = 'sfx::search_request';

/**
 * Fired when a search response has been received from the server.
 * The payload is the search response.
 */
export const SEARCH_RESPONSE_EVENT = 'sfx::search_response';

/**
 * Fired when an error has occurred during a search request.
 */
export const SEARCH_ERROR_EVENT = 'sfx::search_error';
