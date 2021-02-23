[![pipeline status](http://gitlab.heili.eu/lukas/openmediacenter/badges/master/pipeline.svg)](http://gitlab.heili.eu/lukas/openmediacenter/-/commits/master)
[![coverage report](http://gitlab.heili.eu/lukas/openmediacenter/badges/master/coverage.svg)](http://gitlab.heili.eu/lukas/openmediacenter/-/commits/master)
# Open Media Center

Github: This is only a clone of the main Repository.
Feel free to contribute or open an issue here: https://gitlab.heili.eu/lukas/openmediacenter

## What is this?
Open Media Center is an open source solution for a mediacenter in your home network.
Transform your webserver into a mediaserver.
It's based on Reactjs and golang is used for backend.
It is optimized for general videos as well as for movies. 
For grabbing movie data TMDB is used. 
With the help of tags you can organize your video gravity.

Here you can see an example main page in light mode:

![Image of OpenMediaCenter](https://i.ibb.co/pnDjgNT/Screenshot-20200812-172945.png)

and in dark mode:

![](https://i.ibb.co/xzhdsbJ/Screenshot-20200812-172926.png)

## Installation
First of all clone the repository.

`git clone https://gitlab.heili.eu/lukas/openmediacenter.git`

Then build a production build via npm. 

`npm run build`

Afterwards you can copy the content of the generated `build` folder as well as the `api` folder to your webserver root. 

You need also to setup a Database with the structure described in [SQL Style Reference](https://gitlab.heili.eu/lukas/openmediacenter/-/blob/master/database.sql). 
The login data to this database needs to be specified in the `api/Database.php` file.
 
## Usage
Now you can access your MediaCenter via your servers global ip (:

At the settings tab you can set the correct videopath on server and click reindex afterwards. 

## Contact
Any contribution is appreciated. 
Feel free to contact me (lukas.heiligenbrunner@gmail.com), open an issue or request a new feature. 

