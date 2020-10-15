import { EditorNodeProperties } from "node-red";
import { ErSensorObservationOptions } from "../../shared/types";

export interface ErSensorObservationEditorNodeProperties
  extends EditorNodeProperties,
    ErSensorObservationOptions {}
