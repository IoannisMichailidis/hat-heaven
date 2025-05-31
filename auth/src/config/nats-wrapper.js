// Dedicated for publishing events

import nats from "node-nats-streaming";

class NatsWrapper {
    constructor() {
        this._client = null;
    }
    // Make the client accessible in the whole app leveraging getters
    // Make sure that it can be accessed only if the connection has been created first
    // access client using just .client
    get client() {
        if (!this._client) {
            throw new Error('Cannot access NATS client before connecting')
        }
        return this._client;
    }

    // clusterId = hat-heaven
    // clientId = 123
    // url = http://localhost:4222
    connect(clusterId, clientId, url) {
        // create a client instance
        this._client = nats.connect(clusterId, clientId, {url});

        // convert the callback way of the event to promises
        return new Promise((resolve, reject) => {
            this._client.on('connect', () => {
                console.log('Connected to NATS');
                resolve();
            })

            this._client.on('error', (err) => {
                reject(err);
            })
        })
    }
}

// We expose the instance of the NatsWrapper instead of the NatsWrapper class in order to share the same instance to all the app
export const natsWrapper = new NatsWrapper();


