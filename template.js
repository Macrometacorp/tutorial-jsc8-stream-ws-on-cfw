const template = `
<style>
    body {
    margin: 1rem;
    font-family: monospace;
    }
    .grid-container {
    display: grid;
    padding: 10px;
    }
    .grid-item1 {
    grid-column: 1/3;
    padding: 20px 0;
    }
    .grid-item2 {
    grid-column: 3/5;
    padding: 20px 0;
    }
</style>
<div class="grid-container">
<div class="grid-item1">
    <p>
    <h3>Producer for Stream: \`SampleStream\`</h3>
    </p>
    <p>
        <button id="startProducer" data-type="producer">Start Connection</button>
        <button id="addMessage">Add Message to Stream</button>
        <button id="stopProducer" data-type="producer">Close Connection</button>
    </p>
    <h4>Message Added to Stream</h4>
    <ul id="events"></ul>
</div>
<div class="grid-item2">
    <p>
    <h3>Consumer for Stream: \`SampleStream\`</h3>
    </p>
    <p>
        <button id="startConsumer" data-type="consumer">Start Connection</button>
        <button id="stopConsumer" data-type="consumer">Close Connection</button>
    </p>
    <h4>Incoming WebSocket Message Payload</h4>
    <ul id="incomingEvents"></ul>
</div>
<script>
let wsProducer
let wsConsumer

const websocket = async (url, type) => {
    const ws = new WebSocket(url)

    if (!ws) {
        throw new Error("server didn't accept ws")
    }

    ws.addEventListener("open", () => {
        console.log("Opened websocket")
    })

    if (type !== "producer") {
        ws.addEventListener("message", (message) => {
            const parsedMessage = JSON.parse(message.data)
            ws.send(JSON.stringify({ messageId: parsedMessage.messageId }))
            addNewEvent("incomingEvents", parsedMessage)
        })
    }

    ws.addEventListener("close", () => {
        console.log("Closed websocket")
    })
    return ws
}

const addNewEvent = (selector, data) => {
    const list = document.querySelector(\`#\${selector}\`)
    const item = document.createElement("li")
    item.innerText = new Date(JSON.parse(atob(data.payload)).startTime)
    list.prepend(item)
}

const startWsConnection = async (event) => {
    console.log("Starting Stream Websocket")
    const url = new URL(window.location)
    url.protocol = "wss"

    if (event.target.dataset.type === "producer") {
        url.search = "?streamType=producer&streamName=SampleStream"
        url.pathname = "/setupWebsocket"
        wsProducer = await websocket(url, event.target.dataset.type)
        return
    }

    url.search = "?streamType=consumer&streamName=SampleStream"
    url.pathname = "/setupWebsocket"
    wsConsumer = await websocket(url, event.target.dataset.type)
}

const closeWsConnection = (event) => {
    console.log("Closing Stream Websocket")
    if (event.target.dataset.type === "producer") {
        wsProducer.close()
        return
    }

    wsConsumer.close()
}

const addMessage = () => {
    const message = {
        payload: btoa(
            JSON.stringify({
                startTime: new Date().getTime(),
            })
        ),
        context: "1",
    }
    wsProducer.send(JSON.stringify(message))
    addNewEvent("events", message)
}

document.querySelector("#startConsumer").addEventListener("click", startWsConnection)
document.querySelector("#stopConsumer").addEventListener("click", closeWsConnection)

document.querySelector("#startProducer").addEventListener("click", startWsConnection)
document.querySelector("#addMessage").addEventListener("click", addMessage)
document.querySelector("#stopProducer").addEventListener("click", closeWsConnection)
</script>
`

export default () => {
  return new Response(template, {
    headers: {
      'Content-type': 'text/html; charset=utf-8'
    }
  })
}
