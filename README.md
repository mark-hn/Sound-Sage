## Sound-Sage
An AI Spotify artist recommendation tool.

**Instructions** (for local use with your own API keys):
1. Open two terminals within the top level of the directory.

2. Navigate the first terminal to the ```server``` directory using ```cd server```. Download node.js and all of the dependencies listed in ```package.json```, then run ```npm run start``` or ```node server.js``` to start the server.

3. Navigate the second terminal to the ```client``` directory using ```cd client```. Download node.js and all of the dependencies listed in ```package.json```, then run ```npm start```.

4. You should see a web page open in your browser. Click the button ```Login with Spotify```, then use the bottom naviagtion bar to view your top artists and AI-recommended artists. Note: generating your recommended artists may take a few seconds.


**IMPORTANT NOTE**: If you've just created a Spotify account or haven't used it much in the last six months, the Spotify web API might not be able to fetch your top artists.
