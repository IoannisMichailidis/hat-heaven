export class Publisher {
  // Simulating abstract class behavior
  constructor(client, subject) {
    if (this.constructor === Publisher) {
      throw new Error("Cannot instantiate abstract class Publisher directly.");
    }
    this.client = client;
    this.subject = subject;

    if (!this.subject) {
      throw new Error("Listener subclass must define subject");
    }
  }

  publish(data) {
    // Handle Async Operation Manually
    return new Promise((resolve, reject) => {
      // send the data to the NAT streaming server passing the subject(to know in which channel to go) and the real data
      // there is also an optional third parameter (cb) which will be envoked when the data is published
      // we need to serialize that object to JSON to send it over to the NAT streaming server
      this.client.publish(this.subject, JSON.stringify(data), (err) => {
        if (err) {
          return reject(err);
        }

        console.log("Event published to subject", this.subject);
        resolve();
      });
    })


  }
}
