import { NodeAPI } from "node-red";
import { EarthrangerConnectionNode } from "../earthranger-connection/modules/types";
import { EarthrangerBaseNode, EarthrangerBaseNodeDef } from "./types";

export function setConnection(
  baseNode: EarthrangerBaseNode,
  config: EarthrangerBaseNodeDef,
  RED: NodeAPI
): EarthrangerConnectionNode {
  const earthrangerConnection = <EarthrangerConnectionNode>(
    RED.nodes.getNode(config.connection)
  );
  if (!earthrangerConnection) {
    baseNode.error("No earthranger connection set");
    baseNode.status({
      fill: "red",
      shape: "dot",
      text: "error",
    });
    return earthrangerConnection;
  }
  // TODO: validate connection status (do a request, validate if it came trough, if yes connected, if no disconnected)
  baseNode.status({
    fill: "green",
    shape: "dot",
    text: "connected",
  });
  return earthrangerConnection;
}
