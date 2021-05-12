const https = require('https');
const fs = require('fs');
const ffprobe = require('ffprobe-client');
const _exec = require('child_process').exec;

function getFileInfo(msg){
    try {
        const [file,rnum] = [msg.attachments.array()[0].url,Math.floor(Math.random() * 100)]
        https.get(file, function (response) {
            const A = `FileInfo\\Workspace\\A_${rnum}`;
            var endFile = fs.createWriteStream(A);
            var stream = response.pipe(endFile);
            stream.on('finish', function () {
                ffprobe(A)
                .then(data => {
                    const streamData = {
                        "sampleRate": data.streams[0].sample_rate,
                        "channels": data.streams[0].channels,
                        "bitsPerSample": data.streams[0].bits_per_sample
                    }
                    const formatData = {
                        "format": data.format.format_name,
                        "formatLongName": data.format.format_long_name
                    }
                    var embed = {
                        "title": `Information about file`,
                        "color": 0X36393F,
                        "fields": [
                            {
                                "name": 'Stream one data',
                                "value": [
                                    `Sample Rate: ${streamData['sampleRate']}`,
                                    `Channels: ${streamData['channels']}`,
                                    `Bits per sample: ${streamData['bitsPerSample']}`
                                ]
                            },
                            {
                                "name": "Stream one format",
                                "value": [
                                    `Format: ${formatData['format']}`,
                                    `Format Long Name: ${formatData['formatLongName']}`
                                ]
                            }
                        ],
                        "author": { 
                            "name": msg.author.username, 
                            "icon_url": msg.author.avatarURL() 
                        } 
                    };
                    msg.member.send({ embed: embed });
                    msg.reply('Sent the file information to your dms :)');
                    setTimeout(() => { _exec(`Del "${A}"`, () => { console.log('Deleted All Files') }) }, 15000);
                })
                .catch(err => msg.reply('Error Occured on ffprobe.',err))
            });
        })
    } catch {
        msg.reply('Error Occured.');
    };
};

module.exports = {getFileInfo: getFileInfo};