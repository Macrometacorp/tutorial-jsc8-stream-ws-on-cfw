# WebSocket on Cloudflare for Streams

This tutorial will demo how you can use jsc8 stream with Cloudflare edge worker.

## How to Run and Publish on Cloudflare worker
>```
> git clone https://github.com/Macrometacorp/tutorial-jsc8-stream-ws-on-cfw
> cd tutorial-jsc8-stream-ws-on-cfw
> npm install
> update `account_id` in wrangler.toml
> wrangler preview
> wrangler publish //CF Publish
>```

### How to create websocket stream connection with Cloudflare edge worker 

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
    "cloudflare", // When creating a stream reader, pass "cloudflare" as the last parameter in order to create Cloudflare websocket connection
)
```

2. Creating Stream Producer 
```js
const stream = jsc8Client.stream(streamName, true)
const consumerOTP = await stream.getOtp()
client = await stream.producer(
    "gdn1.paas.macrometa.io",, 
    { otp: consumerOTP }, 
    "cloudflare" // When creating a stream producer, pass "cloudflare" as the last parameter in order to create Cloudflare websocket connection
)
```
