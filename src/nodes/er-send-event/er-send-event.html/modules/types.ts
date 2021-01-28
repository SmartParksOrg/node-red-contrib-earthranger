import { EditorNodeProperties } from "node-red";
import { ErSendEventOptions } from "../../shared/types";

export interface ErSendEventEditorNodeProperties
  extends EditorNodeProperties,
    ErSendEventOptions {}
