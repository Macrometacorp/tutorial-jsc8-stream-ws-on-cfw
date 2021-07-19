# WebSocket on Cloudflare for Streams

This tutorial will demo how can you use jsc8 stream with Cloudflare edge worker.

## How to Run
>```
> git clone https://github.com/Macrometacorp/tutorial-jsc8-stream-ws-on-cfw
> cd tutorial-jsc8-stream-ws-on-cfw
> npm install
> update `account_id` in wrangler.toml
> wrangler preview
>```

## Deploy on Cloudflare worker
>```
> git clone https://github.com/Macrometacorp/tutorial-jsc8-stream-ws-on-cfw
> cd tutorial-jsc8-stream-ws-on-cfw
> npm install
> update `account_id` in wrangler.toml
> wrangler publisher
>```

### Key difference in regular stream connection and cloudflare edge worker stream connection

1. Creating jsC8 client
```js
const jsc8Client = new jsc8({
    url: "https://gdn1.paas.macrometa.io/",
    apiKey: "xxxx",
    agent: fetch.bind(this), // Need additional "agent" parameter with value "fetch.bind(this)"
})
```

2. Creating Stream reader 
```js
const stream = jsc8Client.stream(streamName, true)
const consumerOTP = await stream.getOtp()

client = await stream.consumer(
    "SampleStream-my-subscription",
    "gdn1.paas.macrometa.io",
    { otp: consumerOTP },
    "cloudflare", // When creating stream reader pass last parameter as "cloudflare" for jsc8 to create Cloudflare websocket connection to Stream
)
```

2. Creating Stream Producer 
```js
const stream = jsc8Client.stream(streamName, true)
const consumerOTP = await stream.getOtp()
client = await stream.producer(
    "gdn1.paas.macrometa.io",, 
    { otp: consumerOTP }, 
    "cloudflare" // When creating stream producer pass last parameter as "cloudflare" for jsc8 to create Cloudflare websocket connection to Stream
)
```