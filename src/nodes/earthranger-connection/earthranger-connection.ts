import { NodeInitializer } from "node-red";
import {
  EarthrangerConnectionNode,
  EarthrangerConnectionNodeDef,
} from "./modules/types";

import https, { RequestOptions } from "https";
import { IncomingMessage } from "http";

const nodeInit: NodeInitializer = (RED): void => {
  function EarthrangerConnectionNodeConstructor(
    this: EarthrangerConnectionNode,
    config: EarthrangerConnectionNodeDef
  ): void {
    RED.nodes.createNode(this, config);

    this.host = config.host;
    this.username = config.username;
    this.password = config.password;
    this.clientId = config.clientId;

    if (!this.host || !this.username || !this.password) {
      this.error("No Host, Username or Password set");
      return;
    }

    const options = {
      host: this.host,
      path: "/oauth2/token/",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
    };

    reqAuthToken(this, options);
  }

  function reqAuthToken(
    node: EarthrangerConnectionNode,
    options: RequestOptions
  ): void {
    const callback = (response: IncomingMessage) => {
      let str = "";
      response.on("data", (chunk: string) => {
        str += chunk;
      });

      response.on("end", () => {
        const res = parseJson(str, node);
        node.apiError = false;
        node.accessToken = res.access_token;
        node.refreshToken = res.refresh_token;
        node.expiresIn = res.expires_in;
        setTimeout(() => {
          reqRefreshToken(node, options);
        }, node.expiresIn * 1000 - 1000);
      });
    };

    const req = https.request(options, callback);
    req.on("error", () => {
      node.error("the host is unreachable while authenticating");
      node.connectionError = true;
      node.status({
        fill: "red",
        shape: "dot",
        text: "the host is unreachable",
      });
      return;
    });

    req.write(
      "grant_type=password&username=" +
        node.username +
        "&password=" +
        node.password +
        "&client_id=" +
        node.clientId
    );
    req.end();
  }

  function reqRefreshToken(
    node: EarthrangerConnectionNode,
    options: RequestOptions
  ): void {
    const callback = (response: IncomingMessage) => {
      let str = "";
      response.on("data", (chunk: string) => {
        str += chunk;
      });

      response.on("end", () => {
        const res = parseJson(str, node);
        node.apiError = false;
        node.accessToken = res.access_token;
        node.refreshToken = res.refresh_token;
        node.expiresIn = res.expires_in;
        setTimeout(() => {
          reqRefreshToken(node, options);
        }, node.expiresIn * 1000 - 1000);
      });
    };
    const req = https.request(options, callback);
    req.on("error", () => {
      node.error("the host is unreachable while refreshing the authentication");
      node.connectionError = true;
      node.status({
        fill: "red",
        shape: "dot",
        text: "the host is unreachable",
      });
      return;
    });

    req.write(
      "grant_type=refresh_token" +
        "&refresh_token=" +
        node.refreshToken +
        "&client_id=" +
        node.clientId
    );
    req.end();
  }

  RED.nodes.registerType(
    "earthranger-connection",
    EarthrangerConnectionNodeConstructor
  );
};

function parseJson(str : any, node :EarthrangerConnectionNode) {
  if (str.length == 0) {
    node.apiError = true;
    node.status({
      fill: "red",
      shape: "ring",
      text: "empty string",
    });
    node.error("ER: empty string");
    return;
  }

  const res = JSON.parse(str);

  if (res.validate(res, str) == false) {
    node.apiError = true;
    node.status({
      fill: "red",
      shape: "ring",
      text: "invalid json input",
    });
    node.error("ER: invalid json input: " + str);
    return;
  }
  if (res.error) {
    node.apiError = true;
    node.status({
      fill: "red",
      shape: "ring",
      text: "cannot login",
    });
    node.error("ER: Json validation Error: " + res.error);
    return;
  }
  return res;
}

export = nodeInit;
