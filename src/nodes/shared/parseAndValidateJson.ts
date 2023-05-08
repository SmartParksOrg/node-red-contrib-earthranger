import { EarthrangerBaseNode } from "./types";

export function parseAndValidateJson(str: any, node: EarthrangerBaseNode) {
    if (str.length == 0) {
        node.status({
            fill: "red",
            shape: "ring",
            text: "empty string",
        });
        node.error("ER: empty string");
        return false;
    }

    try {
        JSON.parse(str);
    } catch (e) {
        node.status({
            fill: "red",
            shape: "ring",
            text: "invalid json input",
        });
        node.error("ER: invalid json input: " + e);
        return false;
    }

    const res = JSON.parse(str);

    if (res.error) {
        node.status({
            fill: "red",
            shape: "ring",
            text: "cannot parse json",
        });
        node.error("ER: Json validation Error: " + res.error);
        return false;
    }
    return res;
}

