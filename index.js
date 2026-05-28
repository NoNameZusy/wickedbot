const { Client, GatewayIntentBits, PermissionsBitField, EmbedBuilder } = require("discord.js");

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

client.on("ready", () => {
 console.log(`Bot is online as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
 if (message.author.bot) return;

 const args = message.content.split(" ");
 const command = args[0].toLowerCase();
 const member = message.mentions.members.first();

 // ❓ HELP COMMAND
 if (command === "!help") {
   const embed = new EmbedBuilder()
     .setTitle("📋 Command List")
     .setColor(0x5865f2)
     .setDescription("Here are all available commands:")
     .addFields(
       { name: "!sign @user", value: "Gives the user the Premium role and removes Unsigned role.", inline: false },
       { name: "!unsign @user", value: "Removes the user's Premium role and gives Unsigned role.", inline: false },
       { name: "!kick @user [reason]", value: "Kicks the mentioned user from the server.", inline: false },
       { name: "!ban @user [reason]", value: "Bans the mentioned user from the server.", inline: false },
       { name: "!clear <amount>", value: "Deletes the specified number of messages (1-100).", inline: false },
       { name: "!help", value: "Shows this command list.", inline: false }
     )
     .setFooter({ text: "[] = optional, <> = required" })
     .setTimestamp();

   return message.reply({ embeds: [embed] });
 }

 // ❌ No mention check
 if (!member && ["!unsign", "!sign", "!kick", "!ban"].includes(command)) {
   return message.reply("❌ Please mention a user. Example: !kick @user");
 }

 // 🔻 UNSIGN COMMAND
 if (command === "!unsign") {
   if (!message.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
     return message.reply("❌ You need the **Manage Roles** permission to use this command.");
   }
   try {
     await member.roles.remove(PREMIUM_ROLE_ID);
     await member.roles.add(UNSIGNED_ROLE_ID);
     return message.reply(`✅ **${member.user.tag}** has been unsigned.`);
   } catch (err) {
     console.log(err);
     return message.reply("❌ Error: Permission or role hierarchy issue.");
   }
 }

 // 🔺 SIGN COMMAND
 if (command === "!sign") {
   if (!message.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
     return message.reply("❌ You need the **Manage Roles** permission to use this command.");
   }
   try {
     await member.roles.remove(UNSIGNED_ROLE_ID);
     await member.roles.add(PREMIUM_ROLE_ID);
     return message.reply(`✅ **${member.user.tag}** has been signed (premium restored).`);
   } catch (err) {
     console.log(err);
     return message.reply("❌ Error: Permission or role hierarchy issue.");
   }
 }

 // 👢 KICK COMMAND
 if (command === "!kick") {
   if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
     return message.reply("❌ You need the **Kick Members** permission to use this command.");
   }
   const reason = args.slice(2).join(" ") || "No reason provided";
   try {
     await member.kick(reason);
     return message.reply(`✅ **${member.user.tag}** has been kicked. Reason: ${reason}`);
   } catch (err) {
     console.log(err);
     return message.reply("❌ Error: Could not kick the user. Check role hierarchy and permissions.");
   }
 }

 // 🔨 BAN COMMAND
 if (command === "!ban") {
   if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
     return message.reply("❌ You need the **Ban Members** permission to use this command.");
   }
   const reason = args.slice(2).join(" ") || "No reason provided";
   try {
     await member.ban({ reason });
     return message.reply(`✅ **${member.user.tag}** has been banned. Reason: ${reason}`);
   } catch (err) {
     console.log(err);
     return message.reply("❌ Error: Could not ban the user. Check role hierarchy and permissions.");
   }
 }

 // 🗑️ CLEAR COMMAND
 if (command === "!clear") {
   if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
     return message.reply("❌ You need the **Manage Messages** permission to use this command.");
   }
   const amount = parseInt(args[1]);
   if (!amount || isNaN(amount) || amount < 1 || amount > 100) {
     return message.reply("❌ Please enter a valid number. Example: !clear 10 (between 1-100)");
   }
   try {
     const deleted = await message.channel.bulkDelete(amount + 1, true);
     const confirmMsg = await message.channel.send(`✅ Successfully deleted **${deleted.size - 1}** messages.`);
     setTimeout(() => confirmMsg.delete().catch(() => {}), 3000);
   } catch (err) {
     console.log(err);
     return message.reply("❌ Error: Could not delete messages. (Messages older than 14 days cannot be deleted)");
   }
 }
});
