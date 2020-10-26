import { NodeInitializer } from "node-red";
import {
  ErSensorObservationNode,
  ErSensorObservationNodeDef,
} from "./modules/types";
import { setConnection } from "../shared/setConnection";
import { IncomingMessage } from "http";
import https from "https";
import moment from "moment";

const nodeInit: NodeInitializer = (RED): void => {
  function ErSensorObservationNodeConstructor(
    this: ErSensorObservationNode,
    config: ErSensorObservationNodeDef
  ): void {
    RED.nodes.createNode(this, config);
    this.earthrangerConnection = setConnection(this, config, RED);

    this.on("input", (msg, send, done) => {
      //reload the connection for refreshed token
      this.earthrangerConnection = setConnection(this, config, RED);

      //setup the request header and url
      const options = {
        host: this.earthrangerConnection.host,
        path: "/api/v1.0/sensors/generic/smartparks/status",
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

      // create the (json) dataset
      // old observation With All Params
      // const observation = {
      //   location: {
      //     latitude: 47.123,
      //     longitude: -122.123,
      //   },
      //   recorded_at: moment().toISOString(),
      //   manufacturer_id: "Foreign key",
      //   subject_id: "dunno what this is",
      //   subject_name: "test sensor 1",
      //   subject_groups: ["olifantjes"],
      //   subject_subtype: "car",
      //   model_name: "Sensor type 1",
      //   source_type: "Lora sensor?",
      //   additional: {},
      //   source_additional: {},
      // };

      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      const input: any = msg.payload;
      // console.log("input is: -------------------------------------");
      // console.log(input);
      const observation = {
        location: {
          lat: input.location.lat,
          lon: input.location.lon,
        },
        recorded_at: input.recorded_at || moment().toISOString(),
        manufacturer_id: input.manufacturer_id,
        subject_name: input.subject_name,
        subject_subtype: input.subject_subtype,
        subject_groups: input.subject_groups || ["Smart Parks"],
        model_name: input.model_name,
        source_type: input.source_type || "smart_parks_tracking_device",
        additional: input.additional || {},
      };

      // fire the request
      const req = https.request(options, callback);
      req.write(JSON.stringify(observation));
      req.end();
    });
  }

  RED.nodes.registerType(
    "er-sensor-observation",
    ErSensorObservationNodeConstructor
  );
};

export = nodeInit;
