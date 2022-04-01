import { EditorRED } from "node-red";
import { ErSensorObservationEditorNodeProperties } from "./modules/types";

declare const RED: EditorRED;

RED.nodes.registerType<ErSensorObservationEditorNodeProperties>(
  "er-sensor-observation",
  {
    category: "network",
    color: "#6bbbae",
    defaults: {
      name: { value: "" },
      connection: { value: "", type: "earthranger-connection" },
    },
    inputs: 1,
    outputs: 1,
    icon: "EarthRangerWhite.png",
    paletteLabel: "er sensor observation",
    label: function () {
      return this.name || "er sensor observation";
    },
  }
);
