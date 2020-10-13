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
        const res = JSON.parse(str);
        node.accessToken = res.access_token;
        node.refreshToken = res.refresh_token;
        node.expiresIn = res.expires_in;
        setTimeout(() => {
          reqRefreshToken(node, options);
        }, (node.expiresIn*1000)-1000);
      });
    };

    const req = https.request(options, callback);

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
        const res = JSON.parse(str);
        node.accessToken = res.access_token;
        node.refreshToken = res.refresh_token;
        node.expiresIn = res.expires_in;
        setTimeout(() => {
          reqRefreshToken(node, options);
        }, (node.expiresIn*1000)-1000);
      });
    };
    const req = https.request(options, callback);

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

export = nodeInit;
