const ytdl = require("ytdl-core");
const fs = require("fs");
const path = require("path");

module.exports = {
  download: async (url) => {
    const videoID = url.toString().split("=");

    let info = await ytdl.getInfo(videoID[1]);
    let audioFormats = ytdl.filterFormats(info.formats, "audioonly");
    const filename = info.videoDetails.title.toString().split("|");

    // make directory for downloaded assets
    const directory = await fs.mkdir(
      "./downloaded/" + filename[0] + "/",
      { recursive: true },
      function (err) {
        if (err) {
          console.log(err);
        }
      }
    );

    // save downloaded file information to json file
    const jsonfile = await fs.writeFile(
      path.resolve(`./downloaded/${filename[0]}/${filename[0]}.json`),
      JSON.stringify(info),
      function (err) {
        if (err) {
          console.log(err);
        }
      }
    );

    // save m4a file to folder
    const download = await ytdl(url).pipe(
      fs.createWriteStream(`./downloaded/${filename[0]}/${filename[0]}.m4a`)
    );

    console.log(filename[0] + " Download Complete !");

    return filename[0];
  },
};
