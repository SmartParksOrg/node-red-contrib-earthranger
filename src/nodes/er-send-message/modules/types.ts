import { ErSendMessageOptions } from "../shared/types";
import {
  EarthrangerBaseNode,
  EarthrangerBaseNodeDef,
} from "../../shared/types";

export interface ErSendMessageNodeDef
  extends EarthrangerBaseNodeDef,
    ErSendMessageOptions {}

export interface ErSendMessageNode extends EarthrangerBaseNode {
  requestUrl: string;
}
// export type ErSendMessageNode = EarthrangerBaseNode;
