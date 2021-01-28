import { NodeInitializer } from "node-red";
import { ErSendEventNode, ErSendEventNodeDef } from "./modules/types";
import { setConnection } from "../shared/setConnection";
import { IncomingMessage } from "http";
import https from "https";
import moment from "moment";

const nodeInit: NodeInitializer = (RED): void => {
  function ErSendEventNodeConstructor(
    this: ErSendEventNode,
    config: ErSendEventNodeDef
  ): void {
    RED.nodes.createNode(this, config);
    this.earthrangerConnection = setConnection(this, config, RED);
    this.apiPath = "/api/v1.0/activity/events/";

    this.on("input", (msg, send, done) => {
      //reload the connection for refreshed token
      this.earthrangerConnection = setConnection(this, config, RED);

      //setup the request header and url
      const options = {
        host: this.earthrangerConnection.host,
        path: this.apiPath,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + this.earthrangerConnection.accessToken,
        },
      };
      // handle the request callback
      const callback = (response: IncomingMessage) => {
        let str = "";
        response.on("data", (chunk: string) => {
          str += chunk;
        });

        response.on("end", () => {
          const res = JSON.parse(str);
          if (res.status.code != 201) {
            this.error(res);
            this.status({
              fill: "yellow",
              shape: "ring",
              text:
                "something went wrong in a previous request, see thrown error.",
            });
          }
          msg.payload = res;
          send(msg);
          done();
        });
      };

      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      const input: any = msg.payload;

      if (!input.event_type) {
        msg.payload = "please add an event_type to your object";
        send(msg);
        done();
        return;
      }

      const event = {
        event_type: input.event_type,
        time: moment().toISOString(),
        location: undefined,
        event_details: undefined,
        priority: 0,
      };
      if (input.time) {
        event.time = input.time;
      }
      if (input.location) {
        if (input.location.latitude && input.location.longitude) {
          event.location = input.location;
        }
      }
      if (input.event_details) {
        event.event_details = input.event_details;
      }
      if (
        input.priority === 0 ||
        (input.priority >= 100 && input.priority <= 300)
      ) {
        event.priority = input.priority;
      }

      // fire the request
      const req = https.request(options, callback);
      req.write(JSON.stringify(event));
      req.end();
    });
  }

  RED.nodes.registerType("er-send-event", ErSendEventNodeConstructor);
};

export = nodeInit;
