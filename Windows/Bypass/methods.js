const https = require('https');
const fs = require('fs');
const _exec = require('child_process').exec;

function MKVMP3_Method(msg) {
    try {
        msg.reply('Processing...')
        const [file,rnum] = [msg.attachments.array()[0].url,Math.floor(Math.random() * 100)]
        https.get(file, function (response) {
            fs.readdir('Bypass/Baits', function (err, Baits) {
                if (err) throw err;
                setTimeout(()=>{
                    const Bait = `Bypass\\Baits\\${Baits[Math.floor(Math.random() * Baits.length)]}`;
                    const [A, B, output] = [`Bypass\\Workspace\\A_${rnum}.mp3`, `Bypass\\Workspace\\B_${rnum}.mp3`, `Bypass\\Results\\${Bait.replace('Bypass\\Baits\\', '').replace('.mp3', '')}_${rnum}.mp3`];
                    var endFile = fs.createWriteStream(A);
                    var stream = response.pipe(endFile);
                    stream.on('finish', function () {
                        _exec(`ffmpeg -i ${A} -ac 2 -ar 32000 ${B}`, function (err) {
                            if (err) throw err;
                            _exec(`copy /b ${Bait} + ${B} ${output}`, function (err) {
                                if (err) throw err;
                                var embed = {
                                    "title": `Successfully Applied Method "A" To Your File :)`,
                                    "color": 0X36393F,
                                    "author": { 
                                        "name": msg.author.username, 
                                        "icon_url": msg.author.avatarURL() 
                                    } 
                                };
                                msg.member.send({ embed: embed });
                                msg.member.send({ files: [output] });
                                msg.reply('Sent the bypass to your dms :)');
                                setTimeout(() => { _exec(`Del "${A}" "${B}" "${output}"`, () => { console.log('Deleted All Files') }) }, 15000);
                            });
                        });
                    });
                },3000)
            });
        })
    } catch {
        msg.reply('Error Occured.')
    };
};

module.exports = {MKVMP3_Method: MKVMP3_Method};