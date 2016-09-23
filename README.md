Grymt Spel
==========

## Prerequisites
* Node.js
* npm - Back end package manager
* MongoDB - Database
* Build essentials - Build tools

For Debian-based systems:
```
$ sudo apt-get install npm mongodb-server build-essential
```

For MacOS:
```
brew install npm mongodb
```
Tools for building, gcc, make etc. should already be installed if you have commandline tools for Xcode installed already.

### npm dependencies
* Grunt - Task runner
```
$ sudo npm install -g grunt-cli
```
* Bower - Front end package manager
```
$ sudo npm install -g bower
```

## Set-up
In the project directory, run:
```
$ npm install
```

## Run server
```
$ grunt
```
