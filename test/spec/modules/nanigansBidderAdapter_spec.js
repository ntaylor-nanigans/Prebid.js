import { expect } from 'chai'
import { spec, _getPlatform } from 'modules/nanigansBidAdapter'
import { newBidder } from 'src/adapters/bidderFactory'

describe('Nanigans Bid Adapter', function () {
  const adapter = newBidder(spec)

  describe('.code', function () {
    it('should return a bidder code of nanigans', function () {
      expect(spec.code).to.equal('nanigans')
    })
  })

  describe('inherited functions', function () {
    it('should exist and be a function', function () {
      expect(adapter.callBids).to.exist.and.to.be.a('function')
    })
  })

  describe('.isBidRequestValid', function () {
    let bidRequest = {
      'bidder': 'nanigans',
      'params': {
        'placementId': 123
      },
      'adUnitCode': 'adunit-code',
      'sizes': [[300, 250], [300, 600]],
      'bidId': '30b31c1838de1e',
      'bidderRequestId': '22edbae2733bf6',
      'auctionId': '1d1a030790a475',
    }

    it('should return true when required params found', function () {
      expect(spec.isBidRequestValid(bidRequest)).to.equal(true)
    })

    it('should return false when required params missing', function () {
      delete bidRequest.params.placementId
      expect(spec.isBidRequestValid(bidRequest)).to.equal(false)
    })
  })

  describe('.buildRequests', function () {
    let bidRequest = [{
      'bidder': 'nanigans',
      'params': {
        'placementId': '1a2b3c4d5e6f1a2b3c4d'
      },
      'adUnitCode': 'adunit-code-1',
      'sizes': [[300, 250], [300, 600]],
      'bidId': '30b31c1838de1f',
      'bidderRequestId': '22edbae2733bf6',
      'auctionId': '1d1a030790a475',
    }];

    it('should return a properly formatted request', function () {
      const bidRequests = spec.buildRequests(bidRequest)
      expect(bidRequests.url).to.equal('//rtbe.nanigans.com/header/bidRequest')
      expect(bidRequests.method).to.equal('POST')
      expect(JSON.parse(bidRequests.data).id).to.eql('1d1a030790a475');
    })
  })

  describe('.interpretResponse', function () {
    let bidResponse = {
      'body': {
        'id': 'e22b0030-38c3-4ea9-9598-d1047e6b694b',
        'seatbid': [{
          'bid': [{
            'impid': '27ee2cc9bbab14',
            'price': 10.0,
            'adid': '0',
            'adm': '<div>adm</div>',
            'crid': 'crid123',
            'w': 300,
            'h': 250
          }],
          'seat': 'seat123'
        }]
      }
    };

    let prebidResponse = [{
      requestId: '27ee2cc9bbab14',
      cpm: 10.0,
      width: 300,
      height: 250,
      creativeId: 'crid123',
      netRevenue: true,
      ad: '<div>adm</div>',
      currency: 'USD',
      ttl: 60
    }];

    it('should map bidResponse to prebidResponse', function () {
      const response = spec.interpretResponse(bidResponse);
      response.forEach((resp, i) => {
        expect(resp.requestId).to.equal(prebidResponse[i].requestId);
        expect(resp.cpm).to.equal(prebidResponse[i].cpm);
        expect(resp.width).to.equal(prebidResponse[i].width);
        expect(resp.height).to.equal(prebidResponse[i].height);
        expect(resp.ttl).to.equal(prebidResponse[i].ttl);
        expect(resp.creativeId).to.equal(prebidResponse[i].creativeId);
        expect(resp.netRevenue).to.equal(prebidResponse[i].netRevenue);
        expect(resp.currency).to.equal(prebidResponse[i].currency);
      });
    });
  });
})
