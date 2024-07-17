import { Express } from "express";
import http from "http";
import { configs } from "../config";

export const ListenerPlugin = {
  listen(app: Express) {
    const server = http.createServer(app);
    server.listen(configs.PORT, () => {
      console.log(`\nServer is running on port ${configs.PORT} 💀💀💀\n`);
    });
  },
};
