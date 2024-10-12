const path = require("path");
module.exports = {
  apps: [
    {
      name: "server",
      script: path.join(__dirname + "/dist" , "app.js"),
      exec_mode: "cluster",
      max_memory_restart: "5G",
      watch_delay: 3000,
      ignore_watch: ["./node_modules", "./package.json", "./src"],
      // output: "logs/out.log", // Path to the standard output log file
      // error: "logs/error.log", // Path to the error output log file
    },
  ],
};
