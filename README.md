Here is the stack that we are using:
* client: served up by heroku
	- angular
  	- Sass
  	- jquery 
  	- bootstrap
* server: parse

Here is what you need to install to setup your environment:
1. brew (mac package manager): http://brew.sh/
2. npm (>1.4.20): curl https://www.npmjs.org/install.sh | sh
3. node (javascript server): 'brew install node' (after you've installed brew)
4. sass: sudo gem install sass
5. pull the source code
6. everything else: npm install
7. create an empty file here, this is used for grunt: <root_dir>/server/config/local.env.js

Once you have done all of the above, run this to serve up your code locally: grunt serve

If you want to deploy the latest code to heroku, please do:
1. grunt build
2. cd dist && git add -A && git commit -m "describe your changes here"
3. git push -f heroku master
4. heroku open (optional, will launch website)


Here are all the cool 3rd party tools we are using:
* angular/bootstrap (UI): http://angular-ui.github.io/bootstrap/
* snap (drawer): https://github.com/jtrussell/angular-snap.js
* angular fullstack generator: https://github.com/DaftMonk/generator-angular-fullstack


In case you are wondering, here is how everything is setup:
* we leverage yeoman (http://yeoman.io/) scaffolding
* we then explicitly use angular fullstack generator to setup
	- command: yo angular-fullstack
	- environment:
       	- Javascript
       	- HTML
   		- Sass
   		- uiRouter
   		- Bootstrap