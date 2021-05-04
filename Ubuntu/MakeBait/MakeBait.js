const https = require('https');
const fs = require('fs');
const _exec = require('child_process').exec;

function MakeBait(msg){
    try {
        msg.reply('Generating your bait...')
        const [file,rnum] = [msg.attachments.array()[0].url,Math.floor(Math.random() * 100)]
        https.get(file, function (response) {
            const [A, B] = [`MakeBait/Workspace/A_${rnum}`, `Compress/Results/Bait_${rnum}.mp3`];
            var endFile = fs.createWriteStream(A);
            var stream = response.pipe(endFile);
            stream.on('finish', function () {
                _exec(`ffmpeg -i ${A} -f matroska -acodec libmp3lame -ac 1 -aq 0 -ar 8000 -ss 0 -to 0.45 ${B}`, function (err) {
                    if (err) throw err;
                    var embed = {
                        "title": `Generated your bait :)`,
                        "color": 0X36393F,
                        "author": { 
                            "name": msg.author.username, 
                            "icon_url": msg.author.avatarURL() 
                        } 
                    };
                    msg.member.send({ embed: embed });
                    msg.member.send({ files: [B] });
                    msg.reply('Sent the bait to your dms :)');
                    setTimeout(() => { _exec(`rm -rf ${A} ${B} `, () => { console.log('Deleted All Files'); }); }, 15000);
                });
            });
        })
    } catch {
        msg.reply('Error Occured.')
    }
}

module.exports = {MakeBait: MakeBait}