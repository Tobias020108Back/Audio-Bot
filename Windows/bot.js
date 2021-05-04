const Discord = require('discord.js');
const client = new Discord.Client();
const talkedRecently = new Set();

const bypassMethods = require('./Bypass/methods.js');
const { Compress } = require('./Compress/Compress.js');
const { MakeBait } = require('./MakeBait/MakeBait.js');
const { Options, Token, Prefix } = require('./config.json');

function bytesToSize(bytes) {
	var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
	if (bytes == 0) return 'n/a';
	var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
	if (i == 0) return bytes + ' ' + sizes[i];
	return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
};

function millisToMinutesAndSeconds(millis) {
	var minutes = Math.floor(millis / 60000);
	var seconds = ((millis % 60000) / 1000).toFixed(0);
	return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
};

client.on("message", async function (msg) {
	let body = msg.content.split(" ");
	var whitelistedChannel = false;
	if (Options['Channels'].length > 0) {
		for (i = 0; i < Options['Channels'].length; i++) {
			if (Options['Channels'][i] === msg.channel.id) {
				whitelistedChannel = true;
			};
		};
	} else {
		whitelistedChannel = true;
	};
	if (!whitelistedChannel) {
		return
	};
	if (body[0] === `${Prefix}bypass`) {
		if (msg.attachments.size > 0) {
			if (bytesToSize(msg.attachments.array()[0].size) == 'n/a') {
				return msg.reply('File has no data.');
			}
			if (bytesToSize(msg.attachments.array()[0].size).split(' ')[1] != 'KB' && parseInt(bytesToSize(msg.attachments.array()[0].size).split(' ')[0]) > 7) {
				return msg.reply('File too large.');
			}
			if (talkedRecently.has(msg.author.id)) {
				return msg.reply(`Wait ${millisToMinutesAndSeconds(Options['Timeout'])} before doing another command.`);
			}
			let emojis = ["🇦", "❌"];
			const embed = {
				color: 0X36393F,
				author: {
					name: msg.author.username,
					icon_url: msg.author.avatarURL()
				},
				title: "anti-releases audio-bot",
				url: 'https://github.com/anti-releases/audio-bot',
				description: ":regional_indicator_a: **MKV+MP3 Method**\n\n:x: **Cancel**\nCancels the command.\n\n*Please wait for all the reactions to finish before you select one*"
			};
			const methodSelector = await msg.channel.send({
				embed: embed
			});
			await methodSelector.react(emojis[0]);
			await methodSelector.react(emojis[1]);
			const methodCollector = methodSelector.createReactionCollector(
				(reaction, member) => emojis.includes(reaction.emoji.name) && !member.bot && member.id
			);
			methodCollector.on("collect", function (reaction) {
				reaction.users.remove(msg.author);
				if (reaction.users.cache.has(msg.author.id)) {
					switch (reaction.emoji.name) {
						case emojis[0]:
							bypassMethods.MKVMP3_Method(msg);
							methodCollector.stop();
							methodSelector.delete();
							break;
						case emojis[1]:
							methodCollector.stop();
							methodSelector.delete();
							break;
					};
				}
			});
			talkedRecently.add(msg.author.id);
			setTimeout(() => {
				talkedRecently.delete(msg.author.id);
			}, Options['Timeout']);
		} else {
			msg.reply('No file attached!')
		}
	};
	if (body[0] === `${Prefix}compress`) {
		if (msg.attachments.size > 0) {
			if (bytesToSize(msg.attachments.array()[0].size) == 'n/a') {
				return msg.reply('File has no data.');
			}
			if (bytesToSize(msg.attachments.array()[0].size).split(' ')[1] != 'KB' && parseInt(bytesToSize(msg.attachments.array()[0].size).split(' ')[0]) > 7) {
				return msg.reply('File too large.');
			}
			if (talkedRecently.has(msg.author.id)) {
				return msg.reply(`Wait ${millisToMinutesAndSeconds(Options['Timeout'])} before doing another command.`);
			}
			let emojis = ["🇦", "🇧", "❌"];
			const embed = {
				color: 0X36393F,
				author: {
					name: msg.author.username,
					icon_url: msg.author.avatarURL()
				},
				title: "anti-releases audio-bot",
				url: 'https://github.com/anti-releases/audio-bot',
				description: ":regional_indicator_a: **MP3 Output**\n\n:regional_indicator_b: **OGG Output**\n\n:x: **Cancel**\n\n*Please wait for all the reactions to finish before you select one*"
			};
			const methodSelector = await msg.channel.send({
				embed: embed
			});
			await methodSelector.react(emojis[0]);
			await methodSelector.react(emojis[1]);
			await methodSelector.react(emojis[2]);
			const methodCollector = methodSelector.createReactionCollector(
				(reaction, member) => emojis.includes(reaction.emoji.name) && !member.bot && member.id
			);
			methodCollector.on("collect", function (reaction) {
				reaction.users.remove(msg.author);
				if (reaction.users.cache.has(msg.author.id)) {
					switch (reaction.emoji.name) {
						case emojis[0]:
							Compress(msg, 'mp3');
							methodCollector.stop();
							methodSelector.delete();
							break;
						case emojis[1]:
							Compress(msg, 'ogg');
							methodCollector.stop();
							methodSelector.delete();
							break;
						case emojis[2]:
							methodCollector.stop();
							methodSelector.delete();
							break;
					};
				}
			});
			talkedRecently.add(msg.author.id);
			setTimeout(() => {
				talkedRecently.delete(msg.author.id);
			}, Options['Timeout']);
		} else {
			msg.reply('No file attached!')
		}
	};
	if (body[0] === `${Prefix}makebait`) {
		if (msg.attachments.size > 0) {
			if (bytesToSize(msg.attachments.array()[0].size) == 'n/a') {
				return msg.reply('File has no data.');
			};
			if (bytesToSize(msg.attachments.array()[0].size).split(' ')[1] != 'KB' && parseInt(bytesToSize(msg.attachments.array()[0].size).split(' ')[0]) > 7) {
				return msg.reply('File too large.');
			};
			if (talkedRecently.has(msg.author.id)) {
				return msg.reply(`Wait ${millisToMinutesAndSeconds(Options['Timeout'])} before doing another command.`);
			};
			let emojis = ["✅", "❌"];
			const embed = {
				color: 0X36393F,
				author: {
					name: msg.author.username,
					icon_url: msg.author.avatarURL()
				},
				title: "anti-releases audio-bot",
				url: 'https://github.com/anti-releases/audio-bot',
				description: "Audio gets snipped to 0.5 seconds, so make sure the bait is within 0 to 0.5 seconds.\n\n:white_check_mark: **Continue**\n\n:x: **Cancel**\n\n*Please wait for all the reactions to finish before you select one*"
			};
			const methodSelector = await msg.channel.send({
				embed: embed
			});
			await methodSelector.react(emojis[0]);
			await methodSelector.react(emojis[1]);
			const methodCollector = methodSelector.createReactionCollector(
				(reaction, member) => emojis.includes(reaction.emoji.name) && !member.bot && member.id
			);
			methodCollector.on("collect", function (reaction) {
				reaction.users.remove(msg.author);
				if (reaction.users.cache.has(msg.author.id)) {
					switch (reaction.emoji.name) {
						case emojis[0]:
							MakeBait(msg);
							methodCollector.stop();
							methodSelector.delete();
							break;
						case emojis[1]:
							methodCollector.stop();
							methodSelector.delete();
							break;
					};
				};
			});
			talkedRecently.add(msg.author.id);
			setTimeout(() => {
				talkedRecently.delete(msg.author.id);
			}, Options['Timeout']);
		} else {
			msg.reply('No file attached!')
		};
	};
	if (body[0] === `${Prefix}cmds` || body[0] === `${Prefix}commands`|| body[0] === `${Prefix}cmd`) {
		msg.channel.send({
			embed: {
				title: "anti-releases audio-bot",
				description: "Command list",
				url: "https://github.com/anti-releases/audio-bot",
				color: 0X36393F,
				author: {
					name: msg.author.username,
					icon_url: msg.author.avatarURL()
				},
				fields: [{
						name: `${Prefix}bypass`,
						value: "Give options with bypass method(s) to choose from then applies the selected method to your file."
					},
					{
						name: `${Prefix}compress`,
						value: "Compresses the audio that you input with options of .ogg and .mp3 outputs."
					},
					{
						name: `${Prefix}makebait`,
						value: "Turns your inputted file into a bait for method A"
					}
				]
			}
		});
	};
});

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`)
});

client.login(Token);