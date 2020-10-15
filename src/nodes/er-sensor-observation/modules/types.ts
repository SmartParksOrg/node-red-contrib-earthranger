import { ErSensorObservationOptions } from "../shared/types";
import {
  EarthrangerBaseNode,
  EarthrangerBaseNodeDef,
} from "../../shared/types";

export interface ErSensorObservationNodeDef
  extends EarthrangerBaseNodeDef,
    ErSensorObservationOptions {}

// export interface ErSensorObservationNode extends EarthrangerBaseNode {}
export type ErSensorObservationNode = EarthrangerBaseNode;
