import server from "../dist/server/server.js";

export default {
  fetch(request, context) {
    return server.fetch(request, {}, context);
  }
};
