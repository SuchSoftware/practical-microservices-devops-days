function createEventStore({ db, tableName = 'messages' }) {
  const subscriptions = []

  /**
   * @description - Emits one or more messages to the given stream
   */
  function emit(stream, events) {
    const [streamType, streamId] = stream.split(':')
    const eventsInArray = Array.isArray(events) ? events : [events]

    const insertables = eventsInArray.map(e => ({
      ...e,
      stream_type: streamType,
      stream_id: streamId,
    }))

    return db
      .client(tableName)
      .insert(insertables)
      .then(() => insertables)
  }

  /**
   * @description - Fetches a stream of events and runs them through the given
   *   projection
   */
  function fetch(stream, projection) {
    return getEventsForStream(stream).then(events =>
      events.reduce((prev, event) => {
        if (!projection[event.type]) {
          return prev
        }

        return projection[event.type](prev, event)
      }, projection.$init),
    )
  }

  function getEventsForStream(stream) {
    const [streamType, streamId] = stream.split(':')
    const constraints = { stream_type: streamType }

    if (streamId) {
      constraints.stream_id = streamId
    }

    return db
      .client(tableName)
      .where(constraints)
      .orderBy('id', 'ASC')
  }

  function getNext(subscriber) {
    return getSubscriberPosition(subscriber)
      .then(position =>
        db
          .client(tableName)
          .where('id', '>', position)
          .orderBy('id', 'ASC')
          .limit(1),
      )
      .then(rows => rows[0])
  }

  function getSubscriberPosition(subscriber) {
    return db
      .client('subscriber_positions')
      .where('id', subscriber.id)
      .then(rows => {
        if (rows.length === 0) return 0

        return rows[0].position
      })
  }

  function processMessage(subscriber, message) {
    const handler =
      subscriber.handlerMap[message.stream_type] &&
      subscriber.handlerMap[message.stream_type][message.type]

    return handler ? handler(message) : Promise.resolve(true)
  }

  /**
   * @description - Wraps up setting a
   *   subscriber's read position
   */
  function setSubscriberPosition(subscriber, position) {
    return db.upsert({
      constraint: 'id',
      object: { id: subscriber.id, position },
      table: 'subscriber_positions',
    })
  }

  /**
   * @description - Listen to messages on the given stream.  Can be a specific
   *   stream or a category stream.
   */
  function subscribe(subscriberId, handlerMap) {
    subscriptions.push({ id: subscriberId, handlerMap })
  }

  /**
   * @description - Generally not called from the outside.  This function is
   *   called on each of the timeouts to see if there are new events that need
   *   publishing.
   */
  function tick() {
    return subscriptions.reduce(
      (chain, subscriber) =>
        chain.then(() => getNext(subscriber)).then(message => {
          if (!message) return Promise.resolve(null)

          return processMessage(subscriber, message)
            .then(() => setSubscriberPosition(subscriber, message.id))
            .catch(err => {
              // eslint-disable-next-line no-console
              console.error(
                'error processing:\n',
                `\t${subscriber.id}\n`,
                `\t${message.id}\n`,
                `\t${err}\n`,
              )
            })
        }),
      Promise.resolve(true),
    )
  }

  function poll() {
    return tick().then(() => setTimeout(poll, 1000))
  }

  function start() {
    poll()
  }

  return {
    emit,
    fetch,
    getEventsForStream,
    getNext,
    processMessage,
    setSubscriberPosition,
    start,
    subscribe,
    tick,
  }
}

module.exports = createEventStore
