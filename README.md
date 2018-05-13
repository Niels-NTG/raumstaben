# RAUMSTABEN

Collection of sketches for the Generative Gestaltung course at Folkwang University of Arts.

Setup
-----
The setup allows you to run a local web server using node. If any of that sounds too foreign or is not of interest and you just want to run the sketches, jump down to [Running the Sketches](#Running-the-sketches).

1. Install [node.js](https://nodejs.org) (go for the latest stable version)
2. Open Terminal and navigate over to the `Code-Package-p5.js` folder that you downloaded onto your computer:

  ```
  $ cd path/to/folder
  # e.g. cd /Users/GG/Documents/Code-Package-p5.js
  ```

3. Run:

  ```
  $ npm install
  ```


Running the Sketches
--------------------

While most of the sketches work without running a local webserver, there are some sketches that will not run properly since they use external files<sup>2</sup> (e.g. images or data) to create and inform the visualization. To run the sketches, you are welcome to use a local webserver of your liking.

There are many ways to start a local webserver. Please see the options below (not in any particular order)

**Option 1**

One method is to to use the local webserver of your choice (e.g. [simple python webserver](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/set_up_a_local_testing_server)) and open up `localhost:<port>`in your browser<sup>1</sup>.

```
$ cd path/to/folder
# e.g. cd /Users/GG/Documents/Code-Package-p5.js

$ python -m SimpleHTTPServer
# check localhost:8000
```

**Option 2**

If you've already followed the instructions in the [Setup](#Setup) section and you're using [Node.js](https://nodejs.org/en/), you can follow the instructions below:

1. Start a local web server (with live reload) by typing in your Terminal or Commandline the command below. This will open the `index.html` file (list of all sketches) a new browser window.

  ```
  $ npm start
  ```

2. Click on any of the links 🔗 listed to view and interact with the sketches.
3. Interact, create, save, and share your work!


<sup>1</sup>The default port is `8000`, but you can change the port number by specifying the number after the command `e.g. python -m SimpleHTTPServer 5000`

<sup>2</sup>Some sketches work only as expected when the files are placed online, as the rely on "security" sensitive functionality like loading external files. If you try to view them locally without running a web server, you get some kind of "cross-origin" errors 😭 (see your browser's console). The solution is to serve the files using what's called a [local web server](https://github.com/processing/p5.js/wiki/Local-server). This is what happens when you run `npm start` as shown above or when you run your own local server.

Editing sketches
----------------
To edit or create sketches, open the `sketch.js` file in your text editor of choice. Recommend is to use a text editor specially optimised for programming like those listed below.
- [Visual Studio Code](https://github.com/Microsoft/vscode)
- [Sublime Text](https://www.sublimetext.com/)
- [Atom](https://atom.io/)

To get at better sense on what's going on inside your code, you can use the browser's built-in console to get an insight in your variables and methods. See [this guide](https://www.digitalocean.com/community/tutorials/how-to-use-the-javascript-developer-console) for more information.

Note on using the little-bits sketches
--------------------------------------
To establish communication between the browser and the LittleBits/Arduino hardware, you need to run the application [p5.SerialControl](https://github.com/vanevery/p5.serialcontrol/releases/latest) in the background while the hardware is connected. You also need to upload the Arduino source code to the hardware in order it to work correctly.
