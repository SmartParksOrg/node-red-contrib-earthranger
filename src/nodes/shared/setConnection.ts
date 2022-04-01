import { NodeAPI } from "node-red";
import { EarthrangerConnectionNode } from "../earthranger-connection/modules/types";
import { EarthrangerBaseNode, EarthrangerBaseNodeDef } from "./types";

export function setConnection(
  baseNode: EarthrangerBaseNode,
  config: EarthrangerBaseNodeDef,
  RED: NodeAPI,
  delay = 0
): EarthrangerConnectionNode {
  const earthrangerConnection = <EarthrangerConnectionNode>(
    RED.nodes.getNode(config.connection)
  );
  setTimeout(() => {
    if (earthrangerConnection.connectionError) {
      baseNode.error("the host is unreachable");
      baseNode.status({
        fill: "red",
        shape: "dot",
        text: "the provided host is unavailable",
      });
      return earthrangerConnection;
    }
    if (!earthrangerConnection) {
      baseNode.error("no earthranger connection set");
      baseNode.status({
        fill: "red",
        shape: "dot",
        text: "no earthranger connection set",
      });
      return earthrangerConnection;
    }
    if (earthrangerConnection.apiError) {
      baseNode.error("can not login to Earth Ranger");
      baseNode.status({
        fill: "red",
        shape: "ring",
        text: "cannot login",
      });
      return earthrangerConnection;
    }
    baseNode.status({
      fill: "green",
      shape: "dot",
      text: "connected",
    });
    return earthrangerConnection;
  }, delay);
  return earthrangerConnection;
}
