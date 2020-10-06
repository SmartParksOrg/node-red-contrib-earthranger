import { EditorRED } from "node-red";
import { EarthrangerConnectionEditorNodeProperties } from "./modules/types";

declare const RED: EditorRED;

RED.nodes.registerType<EarthrangerConnectionEditorNodeProperties>(
  "earthranger-connection",
  {
    category: "function",
    color: "#a6bbcf",
    defaults: {
      host: { value: "sandbox.pamdas.org", required: true },
      username: { value: "Username", required: true },
      password: { value: "Password", required: true, type: "password" },
    },
    inputs: 1,
    outputs: 1,
    icon: "EarthRangerWhite.png",
    paletteLabel: "earthranger connection",
    label: function () {
      return this.name || "earthranger connection";
    },
  }
);
