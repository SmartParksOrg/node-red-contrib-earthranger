import { NodeInitializer } from "node-red";
import { ErSendMessageNode, ErSendMessageNodeDef } from "./modules/types";
import { setConnection } from "../shared/setConnection";
import { IncomingMessage } from "http";
import https from "https";
import moment from "moment";
import { parseAndValidateJson } from "../shared/parseAndValidateJson";

const nodeInit: NodeInitializer = (RED): void => {
  function ErMessageNodeConstructor(
    this: ErSendMessageNode,
    config: ErSendMessageNodeDef
  ): void {
    RED.nodes.createNode(this, config);
    this.earthrangerConnection = setConnection(this, config, RED, 1000);
    this.apiPath = "/api/v1.0/messages/";

    this.on("input", (msg, send, done) => {
      //reload the connection for refreshed token
      this.earthrangerConnection = setConnection(this, config, RED);

      // handle the request callback
      const callback = (response: IncomingMessage) => {
        let str = "";
        response.on("data", (chunk: string) => {
          str += chunk;
        });

        response.on("end", () => {
          const res = parseAndValidateJson(str, this);
          // const res = JSON.parse(str);
          if (res.status !== "received") {
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

      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      const message: any = {
        sender: undefined,
        receiver: undefined,
        device: undefined,
        message_type: "inbox",
        text: undefined,
        status: undefined,
        device_location: undefined,
        message_time: moment().toISOString(),
        read: true,
        additional: undefined,
        // manufacturer_id: undefined,
        // source_id: undefined,
        // subject_id: undefined,
      };
      this.requestUrl = this.apiPath;
      const params = new URLSearchParams();
      if (input.manufacturer_id)
        params.append("manufacturer_id", input.manufacturer_id);
      if (input.source_id) params.append("source_id", input.source_id);
      if (input.subject_id) params.append("subject_id", input.subject_id);
      if (params.toString().length > 0) {
        this.requestUrl = this.apiPath + "?" + params;
      }
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

      //setup the request header and url
      const options = {
        host: this.earthrangerConnection.host,
        path: this.requestUrl,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + this.earthrangerConnection.accessToken,
        },
      };

      // fire the request
      const req = https.request(options, callback);
      req.on("error", () => {
        this.error(
          "the host: " + this.earthrangerConnection.host + "is unavailable"
        );
        this.status({
          fill: "red",
          shape: "dot",
          text:
            "the host: " + this.earthrangerConnection.host + "is unavailable",
        });
      });
      req.write(JSON.stringify(message));
      req.end();
    });
  }

  RED.nodes.registerType("er-send-message", ErMessageNodeConstructor);
};

export = nodeInit;
