import { NodeInitializer } from "node-red";
import {
  EarthrangerConnectionNode,
  EarthrangerConnectionNodeDef,
} from "./modules/types";

const nodeInit: NodeInitializer = (RED): void => {
  function EarthrangerConnectionNodeConstructor(
    this: EarthrangerConnectionNode,
    config: EarthrangerConnectionNodeDef
  ): void {
    RED.nodes.createNode(this, config);

    this.on("input", (msg, send, done) => {
      send(msg);
      done();
    });
  }

  RED.nodes.registerType(
    "earthranger-connection",
    EarthrangerConnectionNodeConstructor
  );
};

export = nodeInit;
