'use babel';

import MajiView from './maji-view';
import { BufferedProcess, CompositeDisposable } from 'atom';
import {allowUnsafeEval, allowUnsafeNewFunction} from 'loophole'

const os = require('os');
const fs = require("fs-extra");
const opn = require('opn');
const download = require('download-git-repo');
const path = require("path");
const replace = require('replace-in-file');
const majiImport = require('maji-import');
const remote = require('electron').remote;
const glob = require("glob");

const app = '<script type="text/coffeescript" src="app.coffee"></script>';



export default {

  majiView: null,
  previewUI: null,
  subscriptions: null,
  liveServer: null,
  port: null,
  liveServer2: null,
  port2: null,
  activate(state) {


    // Events subscribed to in atom's system can
    //be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'maji:preview': () => this.showPreview(),
      'maji:close': () => this.discardPreview(),
      'maji:new': () => this.createNewProject(),
      'maji:present': () => this.presentProject(),
      'maji:import': () => this.importDesign()
    }));
  },

  deactivate() {
    if(this.previewUI) this.previewUI.destroy();
    if(this.majiView) this.majiView.destroy();
    if(this.liveServer) this.liveServer.shutdown();
  },

  serialize() {
    if(this.majiView)
    {
      return {
        majiViewState: this.majiView.serialize()
      };
    }
    else return null;
  },

  importDesign() {
    var files = remote.dialog.showOpenDialog(remote.getCurrentWindow(), {properties: ['openFile']});
    var src = null;
    var _thisy = this;
    if(files && files.length) {
       src = files[0];
       var atompaths = atom.project.getPaths()[0];
       var pagename = path.basename(src);
		   pagename = pagename.substring(0,(pagename.indexOf(".") || -1));
       pagename = majiImport.sanitizeName(pagename);
       var createdpages = [];
       majiImport.loadGravitFile(src,function (object) {
          if(object) {
            var name = object["name"];
            var pages = object["pages"];
            for (var i = 0; i < pages.length; i++) {
              var filename = name+"."+pages[i]["pagename"];
              console.log(pages[i])
              fs.outputFileSync(atompaths+"/views/"+filename+".coffee" , majiImport.render(pages[i]["pagename"],pages[i]));
              createdpages.push(filename);
            }
            var imports = glob.sync(atompaths+"/views/*.coffee");
            var updatedimports = ""
            for (var i = 0; i < imports.length; i++) {
              updatedimports = updatedimports + "\n\t"+ app.replace("app.coffee","views/"+path.basename(imports[i]));
            }
            var linkoptions = {
             files: atompaths+'/index.html',
             from: /<!--views#start-->[\s\S]*<!--views#end-->/g,
             to: "<!--views#start-->" + updatedimports + "\n\t<!--views#end-->",
            };
            replace.sync(linkoptions);
          }
       });
    }
  },

  previewPane() {
      var panes = atom.workspace.getCenter().getPanes();
      console.log("Getting panes")
      console.log(panes)
      if(panes.length > 1) {
        return panes[panes.length - 1];
      }
      else {
        var current = atom.workspace.getCenter().getActivePane();
        console.log("Showing current pane")
        console.log(current)
        current.splitRight(atom.workspace.getCenter().getPanes());
        return this.previewPane();
      }
  },

  getRandomInteger(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  },
  presentProject() {
    if(this.port2 == null)
    {
      var _this = this;
      var port = this.getRandomInteger(24444,25444);
      var path = atom.project.getPaths();
      if(path.length===0 || path[0]===null || typeof path[0] === "undefined")
      {
        console.log("No project created");
      }
      else
      {
        allowUnsafeEval(function()
        {
          _this.liveServer2 = require("live-server");
          var params = {
            port: port, // Set the server port. Defaults to 8080.
            host: "0.0.0.0", // Set the address to bind to. Defaults to 0.0.0.0 or process.env.IP.
            root: path[0], // Set root directory that's being served. Defaults to cwd.
            open: false, // When false, it won't load your browser by default.
            file: "index.html", // When set, serve this file for every 404 (useful for single-page applications)
            wait: 300, // Waits for all changes, before reloading. Defaults to 0 sec.
            //mount: [['/components', './node_modules']], // Mount a directory to a route.
            logLevel: null, // 0 = errors only, 1 = some, 2 = lots
            //middleware: [function(req, res, next) { next(); }] // Takes an array of Connect-compatible middleware that are injected into the server middleware stack
          };
          _this.liveServer2.start(params);
          _this.port2 = port;
          setTimeout(function () {
            opn('http://127.0.0.1:'+_this.port2);
          }, 1000);
        });
      }
    }
    else
    {
      opn('http://127.0.0.1:'+this.port2);
    }
  },
  discardPreview() {
    if(this.previewUI) this.previewUI.destroyItem(this.majiView);
    if(this.majiView) this.majiView.destroy();
    if(this.previewUI) this.previewUI.destroy();
    if(this.liveServer)
    {
      this.liveServer.shutdown();
      this.port = null;
    }
  },
  showPreview() {
    console.log('maji preview started');
    //atom.workspace.paneForURI("maji.js");
    var _this = this;
    var port = this.getRandomInteger(44444,45444);
    var path = atom.project.getPaths();
    if(path.length===0 || path[0]===null || typeof path[0] === "undefined")
    {
      console.log("No project created");
    }
    else
    {
      this.previewUI = this.previewPane();
      if(this.port == null)
      {
        allowUnsafeEval(function()
        {
          _this.liveServer = require("live-server");
          var params = {
            port: port, // Set the server port. Defaults to 8080.
            host: "0.0.0.0", // Set the address to bind to. Defaults to 0.0.0.0 or process.env.IP.
            root: path[0], // Set root directory that's being served. Defaults to cwd.
            open: false, // When false, it won't load your browser by default.
            file: "index.html", // When set, serve this file for every 404 (useful for single-page applications)
            wait: 300, // Waits for all changes, before reloading. Defaults to 0 sec.
            //mount: [['/components', './node_modules']], // Mount a directory to a route.
            logLevel: null, // 0 = errors only, 1 = some, 2 = lots
            //middleware: [function(req, res, next) { next(); }] // Takes an array of Connect-compatible middleware that are injected into the server middleware stack
          };
          _this.liveServer.start(params);
          _this.port = port;
        });
      }

      console.log("Local server on port "+this.port)
      console.log("Server root:"+path[0])

      this.majiView = new MajiView(this.port)

      this.previewUI.addItem(this.majiView,{index:0});
      this.majiView.loadContent();
      //this.previewUI.activate();

      this.previewUI.onWillDestroy(function () {
          console.log("Shutting down server")
          if(this.previewUI) this.previewUI.destroyItem(this.majiView);
          if(this.majiView) this.majiView.destroy();
          if(this.previewUI) this.previewUI.destroy();
          if(this.liveServer)
          {
            this.liveServer.shutdown();
            this.port = null;
          }
      });


    }

    return true;

  },
  createNewProject()
  {
      var home = os.homedir()
      var adjectives = ["agreeable","brave","calm","delightful","eager","faithful","gentle","happy","jolly","kind","lively","nice","obedient","proud","relieved","silly","thankful","victorious","witty","zealous","angry","bewildered","clumsy","defeated","embarrassed","fierce","grumpy","helpless","itchy","jealous","lazy","mysterious","nervous","obnoxious","panicky","repulsive","scary","thoughtless","uptight","worried"];
      var names = ["lake","river","water","sea"];
      var randomname = names[this.getRandomInteger(0,names.length-1)];
      var randomadjective = adjectives[this.getRandomInteger(0,adjectives.length-1)];
      var newpath = home+"/maji-studio/"+randomadjective+"-"+randomname;
      var projectname = randomadjective+"-"+randomname;
      atom.confirm({message: 'Create a new Maji Studio project?',
        detailedMessage: 'Your project will be created at: \n'+newpath,
        buttons: {
          "Create Project": function()
          {
              fs.ensureDirSync(home+"/maji-studio/");
              //atom.open({pathsToOpen:[newpath],newWindow:true});
              download('alekcz/maji-template', newpath, function (err) {
                console.log(err ? 'Error' : 'Success')
                if(err)
                {
                  atom.confirm({message: 'Error creating project. ',
                  detailedMessage: "Double check your internet connection and/or your file creation privileges",
                  buttons: {
                    "Okay": function()
                    {
                      console.log("Creation failed")
                    }
                  }});
                }
                else {
                  atom.open({pathsToOpen:[newpath],newWindow:true});
                }
              })
          },
          "Cancel": function()
          {
              console.log("Creation cancelled.");
          }
        }
      });
  }

};
