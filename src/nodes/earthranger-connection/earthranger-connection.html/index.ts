import { EditorRED } from "node-red";
import { EarthrangerConnectionEditorNodeProperties } from "./modules/types";

declare const RED: EditorRED;

RED.nodes.registerType<EarthrangerConnectionEditorNodeProperties>("earthranger-connection", {
  category: "function",
  color: "#a6bbcf",
  defaults: {
    name: { value: "" },
  },
  inputs: 1,
  outputs: 1,
  icon: "file.png",
  paletteLabel: "earthranger connection",
  label: function () {
    return this.name || "earthranger connection";
  },
});
