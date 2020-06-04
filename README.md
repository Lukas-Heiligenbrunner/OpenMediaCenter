# Open Media Center

Github: This is only a clone of the main Repository.
Feel free to contribute or open an issue here: https://gitlab.heili.eu/lukas/openmediacenter

## What is this?
Open Media Center is an open source solution for a mediacenter in your home network.
It's based on Reactjs and  uses PHP for backend.
It is optimized for general videos as well as for movies. 
For grabbing movie data TMDB is used. 
For organizing videos tags are used.

Here you can see an example main page:

![Image of OpenMediaCenter](https://i.ibb.co/pZMj9GL/Screenshot-20200604-163448.png)

## Installation
First of all clone the repository.

`git clone https://gitlab.heili.eu/lukas/openmediacenter.git`

Then build a production build via npm. 

`npm run build`

Afterwards you can copy the content of the generated `build` folder as well as the `api` folder to your webserver root. 

You need also to setup a Database with the structure described in [SQL Style Reference](https://gitlab.heili.eu/lukas/openmediacenter/-/blob/master/database.sql). 
The login data to this database needs to be specified in the `api/Database.php` file.
 
## Usage
To index Videos run on your server: `php extractvideopreviews.php`.

Now you can access your MediaCenter via the servers global ip (:

## Contact
Any contribution is appreciated. 
Feel free to contact me (lukas.heiligenbrunner@gmail.com), open an issue or request a new featur. 

