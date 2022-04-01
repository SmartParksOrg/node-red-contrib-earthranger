import { EditorRED } from "node-red";
import { EarthrangerConnectionEditorNodeProperties } from "./modules/types";

declare const RED: EditorRED;

RED.nodes.registerType<EarthrangerConnectionEditorNodeProperties>(
  "earthranger-connection",
  {
    category: "config",
    color: "#6bbbae",
    defaults: {
      host: { value: "sandbox.pamdas.org", required: true },
      username: { value: "Username", required: true },
      password: { value: "Password", required: true, type: "password" },
      clientId: { value: "Client Id", required: true },
    },
    icon: "EarthRangerWhite.png",
    paletteLabel: "earthranger connection",
    label: function () {
      return this.host + " : " + this.username || "earthranger connection";
    },
  }
);
