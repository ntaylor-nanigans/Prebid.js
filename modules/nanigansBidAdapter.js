import {registerBidder} from 'src/adapters/bidderFactory';
import {BANNER} from 'src/mediaTypes';
const BIDDER_CODE = 'nanigans';
const ENDPOINT_URL = '//rtbe.nanigans.com/header/bidRequest';
export const spec = {
  /**
   * Nanigans Bidder Adapter
   * Build OpenRTB bidRequests then unpack OpenRTB bidResponses
   */
  code: BIDDER_CODE,
  aliases: ['NAN'], // short code
  supportedMediaTypes: [BANNER],
  /**
   * Determines whether or not the given bid request is valid.
   *
   * @param {BidRequest} bid The bid params to validate.
   * @return boolean True if this is a valid bid, and false otherwise.
   */
  isBidRequestValid: function(bidRequest) {
    return !!(bidRequest.params.placementId && bidRequest.sizes);
  },
  /**
   * Make a server request from the list of BidRequests.
   *
   * @param {validBidRequests[]} - an array of bids
   * @return ServerRequest Info describing the request to the server.
  */
  buildRequests: function(validBidRequests, bidderRequest) {
    const openRtbBidRequests = {
      'id': validBidRequests[0].auctionId, // "Auction ID is unique per call to requestBids(), but is the same across ad units."
      'device': {
        'ua': window.navigator.userAgent
      },
      'site': {
        'page': document.location.href
      },
      'imp': validBidRequests.map(bidRequest => ({
        'id': bidRequest.bidId, // Bid ID is unique across ad units and bidders.
        'tagid': bidRequest.params.placementId,
        'banner': {
          'w': bidRequest.sizes[0][0],
          'h': bidRequest.sizes[0][1]
        }
      }))
    };
    return {
      method: 'POST',
      url: ENDPOINT_URL,
      data: JSON.stringify(openRtbBidRequests),
    };
  },

  /**
   * Unpack the response from the server into a list of bids.
   * Nanigans OpenRTB bidResponses are modeled to spec as `.seatbid[].bid[]` so
   *   1. `.map()` through seatbid[]
   *   2. `.map()` through bid[]
   *   3. Convert the bids into prebid bids
   *   4. `.flat()` the nested array in a list of bids
   * @param {ServerResponse} serverResponse A successful response from the server.
   * @return {Bid[]} An array of bids which were nested inside the server.
   */
  interpretResponse: function(serverResponse) {
    if (!serverResponse.body.seatbid) { return []; }
    return serverResponse.body.seatbid.map(seatbid =>
      (seatbid.bid.map(bid => ({
        requestId: bid.impid,
        cpm: bid.price,
        width: bid.w,
        height: bid.h,
        creativeId: bid.crid,
        netRevenue: true,
        ad: bid.adm,
        currency: 'USD',
        ttl: 60
      })))
    ).flat(1);
  }
}
registerBidder(spec);
