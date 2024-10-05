const { Client, IntentsBitField } = require('discord.js');
import { exec } from "node:child_process"
import * as os from "os"
import * as logging from "./logger";
import { getMem } from "./serverHealth"
import { configs } from "./settings" 
import "dotenv/config";

const logger = logging.wichFileToLog("discord");
const discordKey: string = process.env.DISCORD_USED === "production" ? configs.default.discord.prodKey : configs.default.discord.devKey;

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

async function initDiscord() {
  client.on("ready", function (content: any) {
    logger.info(`discord has been initialize - ${content.user.bot}`);
  });

  client.on("messageCreate", function (message: any) {
    if (message.author.bot) return;

    try {
      if (message.content == "status") {
        message.channel.send(getMem());
      } 
      else if (message.content == "log list") {
        for (let logList of logging.logList()) {
          setTimeout(()=>{
            message.channel.send(logList)
          }, configs.default.discord.delay)
        }
      } 
      else if (
        message.content.startsWith("log-") &&
        message.content.endsWith(".log")
       ) {
         for (let logList of logging.readLog(message.content)) {
          setTimeout(()=>{
            message.channel.send(logList)
          }, configs.default.discord.delay)
        }
      }
      else if (
        message.content.startsWith("os")
       ) {
        message.channel.send(`Platform: ${os.platform()}`);
        message.channel.send(`OS Version: ${os.release()}`);
      } 
      else if (
        message.content.startsWith("exec ==>")
       ) {
        const content = message.content.split("==>");
        exec(content[1].trim(), { shell: '/bin/bash' }, (error, stdout, stderr) => {
          if (error) {
            message.channel.send(`exec error: ${error}`);
            return;
          }


          const chunkStdout = stdout.split("\n");

          let stringStdout = "STANDART OUTPUT ==>";
          for (let i = 0; i < chunkStdout.length; i++) {
            setTimeout(()=>{
              if ((stringStdout + chunkStdout[i]).length < 2000 ) {
                stringStdout += chunkStdout[i];
          
                if (i == chunkStdout.length - 1) {
                  message.channel.send(stringStdout);
                }
              } else {
                message.channel.send(stringStdout);
                stringStdout = chunkStdout[i];
              }
            }, configs.default.discord.delay)
          }

          const chunkStderr = stderr.split("\n");

          let stringStderr = "STANDART ERROR ==>";
          for (let i = 0; i < chunkStderr.length; i++) {
            setTimeout(()=>{
              if ((stringStderr + chunkStderr[i]).length < 2000 ) {
                stringStderr += chunkStderr[i];
          
                if (i == chunkStderr.length - 1) {
                  message.channel.send(stringStderr);
                }
              } else {
                message.channel.send(stringStderr);
                stringStdout = chunkStderr[i];
              }
            }, configs.default.discord.delay)
          }

          message.channel.send(`stderr: ${stderr}`);
        });
      } 

    } catch (error) {
      logger.error("Error in sending discord content message");
    }
  });

  if (discordKey && discordKey.length > 0 ) {
    client.login(discordKey);
  } else {
    logger.warn("No discord key provide, cannot be initialize")
  }
}

export { initDiscord };
