var express = require('express')
  , request = require('request')
  , multer = require('multer')
  , api = require('qbittorrent-api-v2');

var app = express();
var upload = multer({ dest: '/tmp/' });
var qbit;

const connectQbit = async () => {
  qbit = await api.connect('http://192.168.1.160:8080', "qbit", "KsDNALwUyGK2MtzaMi9f2DqcjouccFcY7izwT8PTevin3noi6EUexy2zMZdXRovDuUVND5AJbViVf7EzPm2xm4SgqeVfmDcwBhWt");
  console.log("QBit client connected");
}

const username = "qbit";
const pass = "KsDNALwUyGK2MtzaMi9f2DqcjouccFcY7izwT8PTevin3noi6EUexy2zMZdXRovDuUVND5AJbViVf7EzPm2xm4SgqeVfmDcwBhWt";

connectQbit();
app.post('/', upload.single('thumb'), async function (req, res, next) {
  var payload = JSON.parse(req.body.payload);
  console.log('Got webhook for', payload);
  if (payload.event == 'media.play' || payload.event == 'media.resume') {
    const torrents = await qbit.torrents();
    let seeding = "";
    await torrents.forEach(torrent => {
      const state = torrent.state;
      if (state === "uploading" || state === "stalledUP" || state === "queuedUP" || state === "forcedUP") {
        seeding += torrent.hash + "|";
      }
    });
    await qbit.pauseTorrents(seeding);
  } else if (payload.event == 'media.pause' || payload.event == 'media.stop') {
    const torrents = await qbit.torrents();
    let paused = "";
    await torrents.forEach(torrent => {
      const state = torrent.state;
      // pausedDL state for 100% resume certainity
      if (state === "pausedUP" || state === "pausedDL") {
        paused += torrent.hash + "|";
      }
    });
    await qbit.resumeTorrents(paused);
  }

  res.sendStatus(200);
});

app.listen(12000);