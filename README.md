# WebSocket on Cloudflare for Streams

This tutorial will demo how you can use jsc8 stream with Cloudflare edge worker.

## How to Run and Publish on Cloudflare worker
>```
> git clone https://github.com/Macrometacorp/tutorial-jsc8-stream-ws-on-cfw
> cd tutorial-jsc8-stream-ws-on-cfw
> npm install
> update `account_id` in wrangler.toml
> update your apikey in index.js
> wrangler publish //CF Publish
>```

### How to create websocket stream connection with Cloudflare edge worker 

1. Creating jsC8 client
```js
const jsc8Client = new jsc8({
    url: "https://play.macrometa.io",
    apiKey: "XXXXX",   // Change it to your apikey
    fabricName: "_system",
    agent: fetch,  // Cloudflare worker does not support "xhr" hence agent "fetch" is required for jsc8 api calls via cloudflare workers
})
```

2. Creating Stream Consumer 
```js
const stream = jsc8Client.stream(streamName, false)   // false for global stream, true for local stream
const consumerOTP = await stream.getOtp()

clientConsumer = await stream.consumer(
    "SampleStream-my-subscription",
    "play.macrometa.io",
    { otp: consumerOTP },
    "cloudflare", // When creating a stream reader, pass "cloudflare" as the last parameter in order to create Cloudflare websocket connection
)
```

3. Adding on message event listener for the above consumer (uses a cloudflare websocket connection)
```js
clientConsumer.accept()
clientConsumer.addEventListener("message", (msg) => {
    const { payload } = JSON.parse(msg.data);
    console.log("Message Received: ", Buffer.from(payload, "base64").toString("ascii"));
}
```

4. Creating Stream Producer 
```js
const stream = jsc8Client.stream(streamName, false)   // false for global stream, true for local stream
const producerOTP = await stream.getOtp()

clientProducer = await stream.producer(
    "play.macrometa.io",, 
    { otp: producerOTP }, 
    "cloudflare" // When creating a stream producer, pass "cloudflare" as the last parameter in order to create Cloudflare websocket connection
)
```

5. Send messages via the above stream producer
```js
clientProducer.accept()
const message = {
    payload: Buffer.from(
        JSON.stringify({
            startTime: new Date().getTime(),
        })
    ).toString("base64")
}
clientProducer.send(JSON.stringify(message))
```


### How to add jsc8 to your Cloudflare edge worker

1. Add jsc8 to package.json and run npm install
```js
    "dependencies": {
        "jsc8": "0.17.11-update.1"
    }
```

2. Enable node compatibility in wrangler.toml by adding the below line as jsc8 library assumes a node environment
```js
node_compat = true
```

3. Everything is ready now just import jsc8 to your worker file and use it
```js
import jsc8 from "jsc8"

const jsc8Client = new jsc8({
    url: "https://play.macrometa.io",
    apiKey: "XXXXX",   // Change it to your apikey
    fabricName: "_system",
    agent: fetch,  // Cloudflare worker does not support "xhr" hence agent "fetch" is required for jsc8 api calls via cloudflare workers
})
```
