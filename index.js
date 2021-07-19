import template from "./template"
const jsc8 = require("jsc8")

const URL = "https://gdn.paas.macrometa.io"
const jsc8Client = new jsc8({
    url: url,
    apiKey: "xxxx",
    agent: fetch.bind(this),
})

addEventListener("fetch", (event) => {
    event.respondWith(handleRequest(event.request))
})

const macrometaWsHandler = async (request) => {
    let client
    const { searchParams } = new URL(request.url)
    const streamType = searchParams.get("streamType")
    const streamName = searchParams.get("streamName")

    const stream = jsc8Client.stream(streamName, true)
    const consumerOTP = await stream.getOtp()

    if (streamType === "producer") {
        client = await stream.producer(URL.replace("https://", ""), { otp: consumerOTP }, "cloudflare")
    } else {
        client = await stream.consumer(
            "SampleStream-my-subscription",
            URL.replace("https://", ""),
            { otp: consumerOTP },
            "cloudflare",
        )
    }

    return new Response(null, {
        status: 101,
        webSocket: client,
    })
}

async function handleRequest(request) {
    try {
        const pathname = new URL(request.url).pathname
        switch (pathname) {
            case "/":
                return template()
            case "/setupWebsocket":
                try {
                    return await macrometaWsHandler(request)
                } catch (error) {
                    throw error
                }
            default:
                return new Response("Not found", { status: 404 })
        }
    } catch (err) {
        return new Response(err.toString())
    }
}
