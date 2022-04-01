import { EditorRED } from "node-red";
import { ErSendEventEditorNodeProperties } from "./modules/types";

declare const RED: EditorRED;

RED.nodes.registerType<ErSendEventEditorNodeProperties>("er-send-event", {
  category: "network",
  color: "#6bbbae",
  defaults: {
    name: { value: "" },
    connection: { value: "", type: "earthranger-connection" },
  },
  inputs: 1,
  outputs: 1,
  icon: "EarthRangerWhite.png",
  paletteLabel: "er send event",
  label: function () {
    return this.name || "er send event";
  },
});
