import { ErSendMessageOptions } from "../shared/types";
import {
  EarthrangerBaseNode,
  EarthrangerBaseNodeDef,
} from "../../shared/types";

export interface ErSendMessageNodeDef
  extends EarthrangerBaseNodeDef,
    ErSendMessageOptions {}

// export interface ErSendEventNode extends EarthrangerBaseNode {}
export type ErSendMessageNode = EarthrangerBaseNode;
