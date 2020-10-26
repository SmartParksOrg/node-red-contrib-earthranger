import { Node, NodeDef } from "node-red";
import { EarthrangerConnectionOptions } from "../shared/types";

export interface EarthrangerConnectionNodeDef
  extends NodeDef,
    EarthrangerConnectionOptions {}

export interface EarthrangerConnectionNode
  extends Node,
    EarthrangerConnectionOptions {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  apiError: boolean;
}
