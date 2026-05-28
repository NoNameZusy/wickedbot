const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

// 🔐 TOKEN (güvende tut)
client.login("MTUwOTY3OTI4MDE5NDMyNjY3OA.GYW6O9.q2R80Wz_-fgoDVBeqnR8w8dqMYFeuqQa3H_PoU");

// ROLE IDS
const PREMIUM_ROLE_ID = "1504928126625648720";
const UNSIGNED_ROLE_ID = "1506371803730411611";

client.on("ready", () => {
  console.log(`Bot is online as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const member = message.mentions.members.first();

  // ❌ no mention check
  if (!member && (message.content.startsWith("!unsign") || message.content.startsWith("!sign"))) {
    return message.reply("Please mention a user. Example: !unsign @user");
  }

  // 🔻 UNSIGN COMMAND
  if (message.content.startsWith("!unsign")) {
    try {
      await member.roles.remove(PREMIUM_ROLE_ID);
      await member.roles.add(UNSIGNED_ROLE_ID);

      message.reply("User has been unsigned successfully.");
    } catch (err) {
      console.log(err);
      message.reply("Error: permission or role hierarchy issue.");
    }
  }

  // 🔺 SIGN COMMAND
  if (message.content.startsWith("!sign")) {
    try {
      await member.roles.remove(UNSIGNED_ROLE_ID);
      await member.roles.add(PREMIUM_ROLE_ID);

      message.reply("User has been signed (premium restored).");
    } catch (err) {
      console.log(err);
      message.reply("Error: permission or role hierarchy issue.");
    }
  }
});
