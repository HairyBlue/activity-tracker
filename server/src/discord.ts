const { Client, IntentsBitField } = require('discord.js');
import * as logging from "./logger";
import "dotenv/config";

const logger = logging.wichFileToLog("discord");

let client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.DirectMessages,
    IntentsBitField.Flags.GuildMessageTyping,
  ],
});

function bytesToMb(bytes: number) {
  return (bytes / (1024 * 1024)).toString() + " mb";
}

function getServerStatus() {
  return (
    `RSS => ${bytesToMb(process.memoryUsage().rss)}\n` +
    `HEAP TOTAL => ${bytesToMb(process.memoryUsage().heapTotal)}\n` +
    `HEAP USED => ${bytesToMb(process.memoryUsage().heapUsed)}`
  );
}

function initDiscord() {
  client.on("ready", function (content: any) {
    logger.info(`discord has been initialize - ${content.user.bot}`);
  });

  client.on("messageCreate", function (message: any) {
    if (message.author.bot) return;

    if (message.content == "status") {
      message.channel.send(getServerStatus());
    }
    if (message.content == "log list") {
      logging.logList().forEach(list => {
        message.channel.send(list)
      })
    }
    if (message.content.startsWith("log-") && message.content.endsWith(".log") ) {
       message.channel.send(logging.readLog(message.content))
    }
    
    // if (message.content == "bomb") {
    //   message.reply("server is ok");
    //   process.exit(0);
    // }
  });

  client.login(process.env.DISCORD_AT_DEVBOT);
}

export { initDiscord };
