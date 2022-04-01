import { EditorRED } from "node-red";
import { ErSendMessageEditorNodeProperties } from "./modules/types";

declare const RED: EditorRED;

RED.nodes.registerType<ErSendMessageEditorNodeProperties>("er-send-message", {
  category: "network",
  color: "#6bbbae",
  defaults: {
    name: { value: "" },
    connection: { value: "", type: "earthranger-connection" },
  },
  inputs: 1,
  outputs: 1,
  icon: "EarthRangerWhite.png",
  paletteLabel: "er send message",
  label: function () {
    return this.name || "er send message";
  },
});
