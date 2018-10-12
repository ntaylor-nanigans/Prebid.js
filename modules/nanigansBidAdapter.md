# Overview

```
Module Name: Nanigans Bidder Adapter
Module Type: Bidder Adapter
Maintainer: rtb@nanigans.com
```

# Description

Module that connects to Nanigans's demand sources

# Test Parameters
```
    var adUnits = [
        {
            code: 'test-div',
            mediaTypes: {
                banner: {
                    sizes: [[300, 250]],  // a display size
                }
            },
            bids: [
                {
                    bidder: "nanigans",
                    params: {
                        placement: '12345'
                    }
                }
            ]
        },{
            code: 'test-div',
            mediaTypes: {
                banner: {
                    sizes: [[320, 50]],   // a mobile size
                }
            },
            bids: [
                {
                    bidder: "nanigans",
                    params: {
                        placement: 67890
                    }
                }
            ]
        }
    ];
```