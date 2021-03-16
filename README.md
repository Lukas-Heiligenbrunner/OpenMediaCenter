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

Download the latest release .deb file from the Releases page and install it via `apt install ./OpenMediaCenter-0.1.x_amd64.deb`

Now you could optionally check if the service is up and running: `systemctl status OpenMediaCenter`
## Usage
Now you can access your MediaCenter via your servers global ip on port 8080 (:

At the settings tab you can set the correct videopath on server and click reindex afterwards. 


## Development

Build and start the go backend:

`go build`

Start frontend dev server:

`npm start`

### Environent Variables:

`REACT_APP_CUST_BACK_DOMAIN` :: Set a custom movie domain

## Contact
Any contribution is appreciated. 
Feel free to contact me (lukas.heiligenbrunner@gmail.com), open an issue or request a new feature. 

