import { ErSendEventOptions } from "../shared/types";
import {
  EarthrangerBaseNode,
  EarthrangerBaseNodeDef,
} from "../../shared/types";

export interface ErSendEventNodeDef
  extends EarthrangerBaseNodeDef,
    ErSendEventOptions {}

// export interface ErSendEventNode extends EarthrangerBaseNode {}
export type ErSendEventNode = EarthrangerBaseNode;
