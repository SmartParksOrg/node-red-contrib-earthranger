import { Node, NodeDef } from "node-red";
import { EarthrangerConnectionOptions } from "../shared/types";

export interface EarthrangerConnectionNodeDef extends NodeDef, EarthrangerConnectionOptions {}

// export interface EarthrangerConnectionNode extends Node {}
export type EarthrangerConnectionNode = Node;
