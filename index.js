const { Client, GatewayIntentBits, PermissionsBitField } = require("discord.js");

const client = new Client({
 intents: [
   GatewayIntentBits.Guilds,
   GatewayIntentBits.GuildMessages,
   GatewayIntentBits.MessageContent,
   GatewayIntentBits.GuildMembers
 ]
});

client.login(process.env.TOKEN);

const PREMIUM_ROLE_ID = "1504928126625648720";
const UNSIGNED_ROLE_ID = "1506371803730411611";

const ONAYLANDI = "<:onaylandi:1509702074160644158>";
const REDDEDILDI = "<:Reddedildi:1509702233183223930>";

client.on("ready", () => {
 console.log(`Bot is online as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
 if (message.author.bot) return;

 const member = message.mentions.members.first();

 // ❌ no mention check
 if (!member && (message.content.startsWith("!unsign") || message.content.startsWith("!sign"))) {
   return message.reply(`${REDDEDILDI} Please mention a user. Example: !unsign @user`);
 }

 // 🔻 UNSIGN COMMAND
 if (message.content.startsWith("!unsign")) {
   try {
     await member.roles.remove(PREMIUM_ROLE_ID);
     await member.roles.add(UNSIGNED_ROLE_ID);
     message.reply(`${ONAYLANDI} User has been unsigned successfully.`);
   } catch (err) {
     console.log(err);
     message.reply(`${REDDEDILDI} Error: Permission or role hierarchy issue.`);
   }
 }

 // 🔺 SIGN COMMAND
 if (message.content.startsWith("!sign")) {
   try {
     await member.roles.remove(UNSIGNED_ROLE_ID);
     await member.roles.add(PREMIUM_ROLE_ID);
     message.reply(`${ONAYLANDI} User has been signed (premium restored).`);
   } catch (err) {
     console.log(err);
     message.reply(`${REDDEDILDI} Error: Permission or role hierarchy issue.`);
   }
 }

 // 🗑️ CLEAR COMMAND
 if (message.content.startsWith("!clear")) {
   const args = message.content.split(" ");
   const amount = parseInt(args[1]);

   if (!amount || isNaN(amount) || amount < 1 || amount > 100) {
     return message.reply(`${REDDEDILDI} Please enter a valid number. Example: !clear 10 (between 1-100)`);
   }

   if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
     return message.reply(`${REDDEDILDI} You need the **Manage Messages** permission to use this command.`);
   }

   try {
     const deleted = await message.channel.bulkDelete(amount + 1, true);
     const confirmMsg = await message.channel.send(`${ONAYLANDI} Successfully deleted **${deleted.size - 1}** messages.`);
     setTimeout(() => confirmMsg.delete().catch(() => {}), 3000);
   } catch (err) {
     console.log(err);
     message.reply(`${REDDEDILDI} Error: Could not delete messages. (Messages older than 14 days cannot be deleted)`);
   }
 }
});
