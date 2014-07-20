Here is the stack that we are using:
* client: served up by heroku
	- angular
  	- Sass
  	- jquery 
  	- bootstrap
* server: parse

Here is what you need to setup your environment:
* install npm (>1.4.20): curl https://www.npmjs.org/install.sh | sh
* Install brew (mac package manager): http://brew.sh/
* Install node (javascript server): 'brew install node' (after you've installed brew)

Once you have pulled the code, run this to serve up your code locally: 

If you want to deploy the latest code to heroku, please do:
* deploy new build: grunt build
* commit the newest updates: cd dist && git add -A && git commit -m "describe your changes here"
* push to heroku: git push -f heroku master
* view the output: heroku open


In case you are wondering, here is how everything is setup:
* we leverage yeoman as a generator: npm install -g yo@1.2.0
* we then explicitly leverage angular fullstack generator
	- install: npm install -g generator-angular-fullstack
	- environment:
       	- Javascript
       	- HTML
   		- Sass
   		- uiRouter
   		- Bootstrap