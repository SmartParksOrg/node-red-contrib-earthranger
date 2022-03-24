import { EditorNodeProperties } from "node-red";
import { ErSendMessageOptions } from "../../shared/types";

export interface ErSendMessageEditorNodeProperties
  extends EditorNodeProperties,
    ErSendMessageOptions {}
