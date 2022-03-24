import { NodeInitializer } from "node-red";
import { ErSendMessageNode, ErSendMessageNodeDef } from "./modules/types";
import { setConnection } from "../shared/setConnection";
import { IncomingMessage } from "http";
import https from "https";
import moment from "moment";

const nodeInit: NodeInitializer = (RED): void => {
  function ErMessageNodeConstructor(
    this: ErSendMessageNode,
    config: ErSendMessageNodeDef
  ): void {
    RED.nodes.createNode(this, config);
    this.earthrangerConnection = setConnection(this, config, RED);
    this.apiPath = "/api/v1.0/message/";

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
              text: "something went wrong in a previous request, see thrown error.",
            });
          }
          msg.payload = res;
          send(msg);
          done();
        });
      };

      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      const input: any = msg.payload;

      //TODO: Fix all fields belonging to message
      if (!input.event_type) {
        msg.payload = "please add an event_type to your object";
        send(msg);
        done();
        return;
      }

      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      const message: any = {
        sender: undefined,
        receiver: undefined,
        device: undefined,
        message_type: "outbox",
        text: undefined,
        status: undefined,
        device_location: undefined,
        message_time: moment().toISOString(),
        read: true,
        additional: undefined,
      };

      if (input.sender) message.sender = input.sender;
      if (input.receiver) message.receiver = input.receiver;
      if (input.device) message.device = input.device;
      if (input.message_type) message.message_type = input.message_type;
      if (input.text) message.text = input.text;
      if (input.status) message.status = input.status;

      if (input.device_location) {
        if (input.device_location.latitude && input.device_location.longitude) {
          message.device_location = input.device_location;
        }
      }
      if (input.message_time) message.message_time = input.message_time;
      if (input.read) message.read = input.read;
      if (input.additional) message.additional = input.additional;

      // fire the request
      const req = https.request(options, callback);
      req.write(JSON.stringify(message));
      req.end();
    });
  }

  RED.nodes.registerType("er-send-message", ErMessageNodeConstructor);
};

export = nodeInit;