'use babel';

import MojojoView from './mojojo-view';
import { BufferedProcess, CompositeDisposable } from 'atom';
import {allowUnsafeEval, allowUnsafeNewFunction} from 'loophole'

export default {

  mojojoView: null,
  previewUI: null,
  subscriptions: null,
  liveServer: null,
  activate(state) {


    // Events subscribed to in atom's system can
    //be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'mojojo:preview': () => this.showPreview(),
      'mojojo:close': () => this.discardPreview(),
      'mojojo:new': () => this.createNewProject()
    }));
  },

  deactivate() {
    if(this.previewUI) this.previewUI.destroy();
    if(this.mojojoView)this.mojojoView.destroy();
    if(this.liveServer) this.liveServer.shutdown();
  },

  serialize() {
    if(this.mojojoView)
    {
      return {
        mojojoViewState: this.mojojoView.serialize()
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

  discardPreview() {
    if(this.previewUI) this.previewUI.destroyItem(this.mojojoView);
    if(this.mojojoView) this.mojojoView.destroy();
    if(this.previewUI) this.previewUI.destroy();
    if(this.liveServer) this.liveServer.shutdown();
  },
  showPreview() {
    console.log('Mojojo preview started');
    //atom.workspace.paneForURI("mojojo.js");
    var _this = this;
    var port = Math.floor(Math.random()*1000)+44444;
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
      this.mojojoView = new MojojoView(port)
      this.previewUI.addItem(this.mojojoView);
      this.previewUI.onWillDestroy(function () {
          console.log("Shutting down server")
          if(this.previewUI) this.previewUI.destroyItem(this.mojojoView);
          if(this.mojojoView) this.mojojoView.destroy();
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
      atom.directory.create();
  }

};
