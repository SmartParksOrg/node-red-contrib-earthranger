import { Node, NodeDef } from "node-red";
import { EarthrangerConnectionNode } from "../earthranger-connection/modules/types";

export interface EarthrangerBaseNodeDef extends NodeDef {
  connection: string;
}

export interface EarthrangerBaseNode extends Node {
  earthrangerConnection: EarthrangerConnectionNode;
}
