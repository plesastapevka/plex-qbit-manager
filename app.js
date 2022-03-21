var express = require("express"),
  request = require("request"),
  multer = require("multer"),
  api = require("qbittorrent-api-v2");

var app = express();
var upload = multer({ dest: "/tmp/" });
var qbit;

const connectQbit = async () => {
  qbit = await api.connect(
    process.env.QBIT_IP,
    process.env.USERNAME,
    process.env.PASSWORD
  );
};

app.post("/", upload.single("thumb"), async function (req, res, next) {
  var payload = JSON.parse(req.body.payload);
  console.log("Got webhook for ", payload.event);
  if (payload.event == "media.play" || payload.event == "media.resume") {
    try {
      await connectQbit();
      console.debug("QBit connection established");
      const torrents = await qbit.torrents();
      let seeding = "";
      await torrents.forEach((torrent) => {
        const state = torrent.state;
        if (
          state === "uploading" ||
          state === "stalledUP" ||
          state === "queuedUP" ||
          state === "forcedUP"
        ) {
          seeding += torrent.hash + "|";
        }
      });
      await qbit.pauseTorrents(seeding);
      console.log("Torrents paused");
    } catch (err) {
      console.error("Error managing torrents: " + err);
    }
  } else if (payload.event == "media.pause" || payload.event == "media.stop") {
    try {
      await connectQbit();
      console.debug("QBit connection established");
      const torrents = await qbit.torrents();
      let paused = "";
      await torrents.forEach((torrent) => {
        const state = torrent.state;
        // pausedDL state for 100% resume certainity
        if (state === "pausedUP" || state === "pausedDL") {
          paused += torrent.hash + "|";
        }
      });
      await qbit.resumeTorrents(paused);
      console.log("Torrents resumed");
    } catch (err) {
      console.error("Error managing torrents: " + err);
    }
  }

  res.sendStatus(200);
});
if (!process.env.QBIT_IP || process.env.PASSWORD || process.env.USERNAME) {
  console.error("Variables not set. Set the variables and restart the container.");
  process.exit(1);
}
app.listen(12000);
console.log(`Qbit client on ${process.env.QBIT_IP}`);
console.log(`Server listening on port 12000`);

