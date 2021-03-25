export default function createEventSource(url, handler, conf) {
    const eventSource = new EventSource(url, conf)
    eventSource.addEventListener(handler.eventType, event => {
        handler.handle(event)
    })
    return eventSource
}
