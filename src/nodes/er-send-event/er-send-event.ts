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

            const event:any = {
                //location: undefined,
                time: moment().toISOString(),
                //end_time: undefined,
                //serial_number: undefined,
                //message: undefined,
                //provenance: undefined,
                event_type: input.event_type,
                priority: 0,
                //attributes: undefined,
                //comment: undefined,
                //title: undefined,
                //reported_by: undefined,
                //state: undefined,
                //event_details: undefined,
                //related_subjects: undefined,
                //eventsource: undefined,
                //external_event_id: undefined,
                //patrol_segments: undefined,
            };

            if (input.location) {
                if (input.location.latitude && input.location.longitude) {
                    event.location = input.location;
                }
            }
            if (input.time) event.time = input.time;
            if (input.end_time) event.end_time = input.end_time;
            if (input.serial_number) event.serial_number = input.serial_number;
            if (input.message) event.message = input.message;
            if (input.provenance) event.provenance = input.provenance;
            if (input.event_type) event.event_type = input.event_type;
            if (input.priority === 0 ||
                (
                    input.priority >= 100 && input.priority <= 300
                )
            ) {
                event.priority = input.priority;
            }
            if (input.attributes) event.attributes = input.attributes;
            if (input.comment) event.comment = input.comment;
            if (input.title) event.title = input.title;
            if (input.reported_by) event.reported_by = input.reported_by;
            if (input.state) event.state = input.state;
            if (input.event_details) event.event_details = input.event_details;
            if (input.related_subjects) event.related_subjects = input.related_subjects;
            if (input.eventsource) event.eventsource = input.eventsource;
            if (input.external_event_id) event.external_event_id = input.external_event_id;
            if (input.patrol_segments) event.patrol_segments = input.patrol_segments;


            // fire the request
            const req = https.request(options, callback);
            req.write(JSON.stringify(event));
            req.end();
        });
    }

    RED.nodes.registerType("er-send-event", ErSendEventNodeConstructor);
};

export = nodeInit;
