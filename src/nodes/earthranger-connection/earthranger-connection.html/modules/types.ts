import { EditorNodeProperties } from "node-red";
import { EarthrangerConnectionOptions } from "../../shared/types";

export interface EarthrangerConnectionEditorNodeProperties
  extends EditorNodeProperties,
    EarthrangerConnectionOptions {}
