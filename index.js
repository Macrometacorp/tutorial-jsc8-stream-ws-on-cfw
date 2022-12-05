import jsc8 from "jsc8"
import template from "./template"

const gdnUrl = "https://play.macrometa.io"
const jsc8Client = new jsc8({
    url: gdnUrl,
    apiKey: "XXXXX",
    fabricName: "_system",
    agent: fetch,
})

const macrometaWsHandler = async (request) => {
    let client
    const { searchParams } = new URL(request.url)
    const streamType = searchParams.get("streamType")
    const streamName = searchParams.get("streamName")

    const stream = jsc8Client.stream(streamName, false)
    const OTP = await stream.getOtp()

    if (streamType === "producer") {
        client = await stream.producer(gdnUrl.replace("https://", ""), { otp: OTP }, "cloudflare")
    } else {
        client = await stream.consumer(
            "SampleStream-my-subscription",
            gdnUrl.replace("https://", ""),
            { otp: OTP },
            "cloudflare",
        )
    }

    return new Response(null, {
        status: 101,
        webSocket: client,
    })
}

export default {
	async fetch(request) {
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
}
