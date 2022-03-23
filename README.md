# QBitTorrent - Plex Manager for Unraid

## Install guide

Note: You need Plex Pass to enable Webhooks - without it, this won't work.

1. In Plex web go to Settings > Webhooks and click on "Add Webhook". Type in the URL of your Unraid server on port 12000 by default (this is the port where the script listens for events), i.e. `http://192.168.1.5:12000`.

2. Next, go to Unraid WebGUI > Docker tab > Scroll down to "Add Container".

3. Fill in all fields:
   - Name: whatever you like, i.e. `qbit-plex-manager`
   - Repository: `plesastapevka/qbit-plex-manager:buildx-latest`
   - Leave "Network Type" and "Console shell command" as is

4. Now you need to add 3 variables. Click on "Add another Path, Port, Variable, Label or Device" and add:
    
    - 1st variable:
      - Name: `USERNAME`
      - Key: `USERNAME`
      - Value: your QBitTorrent username, i.e. `admin`
      - Description: something descriptive
    
    - 2nd variable:
      - Name: `PASSWORD`
      - Key: `PASSWORD`
      - Value: your qbittorent password, i.e. `mysupersafepassword1`
      - Description: something even more descriptive than before
    
    - 3rd variable:
      - Name: `QBIT_IP`
      - Key: `QBIT_IP`
      - Value: your QBitTorrent IP address, port with trailing http at the beginning, i.e. `http://192.168.1.5:8080`

5. Click on "Apply" and that should be it. For any issues contact me on Telegram [`@plesasta_pevka`](https://t.me/plesasta_pevka) or something.

6. To test if it works simply start streaming on Plex and you should see all completed torrents paused in QBitTorrent. On pausing or stopping the stream, the torrents should resume.
---
## More TODOs, perhaps:
- [ ] Pause torrents only on remote streaming
- [ ] Upload to Community Apps
- [ ] Support for more torrent clients
- [ ] Make a WebUI (I wish)
- [ ] Automate Docker image publish on merge to master branch