'use babel';

import MajiView from './maji-view';
import { BufferedProcess, CompositeDisposable } from 'atom';
import {allowUnsafeEval, allowUnsafeNewFunction} from 'loophole'

const os = require('os');
const fs = require("fs-extra");

export default {

  majiView: null,
  previewUI: null,
  subscriptions: null,
  liveServer: null,
  activate(state) {


    // Events subscribed to in atom's system can
    //be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'maji:preview': () => this.showPreview(),
      'maji:close': () => this.discardPreview(),
      'maji:new': () => this.createNewProject()
    }));
  },

  deactivate() {
    if(this.previewUI) this.previewUI.destroy();
    if(this.majiView)this.majiView.destroy();
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

  previewPane() {
      var panes = atom.workspace.getPanes();
      if(panes.length>1) {
        return panes[panes.length-1];
      }
      else {
        var current = atom.workspace.getActivePane();
        current.splitRight(atom.workspace.getPanes());
        return this.previewPane();
      }
  },

  getRandomInteger(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
  },

  discardPreview() {
    if(this.previewUI) this.previewUI.destroyItem(this.majiView);
    if(this.majiView) this.majiView.destroy();
    if(this.previewUI) this.previewUI.destroy();
    if(this.liveServer) this.liveServer.shutdown();
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
      });

      console.log("Local server on port "+port)
      console.log("Server root:"+path[0])
      this.majiView = new MajiView(port)

      this.previewUI.addItem(this.majiView,{index:0});
      this.majiView.loadContent();
      atom.workspace.getPanes()[0].activate();

      this.previewUI.onWillDestroy(function () {
          console.log("Shutting down server")
          if(this.previewUI) this.previewUI.destroyItem(this.majiView);
          if(this.majiView) this.majiView.destroy();
          if(this.previewUI) this.previewUI.destroy();
          if(this.liveServer)
          {
            this.liveServer.shutdown();
          }
      });
      //I have no idea what this return value is used for
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
      var newpath = home+"/maji/"+randomadjective+"-"+randomname;
      var projectname = randomadjective+"-"+randomname;
      atom.confirm({message: 'Create a new Maji Studio project?',
        detailedMessage: 'Your project will be created at: \n'+newpath,
        buttons: {
          "Create Project": function()
          {
              fs.ensureDirSync(home+"/maji/");
              //atom.open({pathsToOpen:[newpath],newWindow:true});
              const command = 'git'
              const args = ['clone','--depth','1','https://github.com/alekcz/maji-template.git',newpath]
              const stdout = function(output)
              {
                  console.log(output)
              }
              const exit = function(code)
              {
                console.log("git clone https://github.com/alekcz/maji-template.git "+newpath+" with code: "+code);
                fs.remove(newpath+'/.git', err => {
                  if (err) return console.error(err)
                  console.log("Creation confirmed.");
                  atom.open({pathsToOpen:[newpath],newWindow:true});
                })
              }
              const process = new BufferedProcess({command, args, stdout, exit})

          },
          "Cancel": function()
          {
              console.log("Creation cancelled.");
          }
        }
      });
  }

};
