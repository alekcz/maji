'use babel';

import MojojoView from './mojojo-view';
import { CompositeDisposable } from 'atom';


export default {

  mojojoView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.mojojoView = new MojojoView(state.mojojoViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.mojojoView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can
    //be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'mojojo:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.mojojoView.destroy();
  },

  serialize() {
    return null;/*{
      mojojoViewState: this.mojojoView.serialize()
    };*/
  },
  /*penultimatePane() {
      var panes = atom.workspace.getPanes();
      return panes[panes.length-1]
      if(panes.length>1) {
          return panes[panes.length-2];
      }
      else return panes[0];
  },*/
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

  toggle() {
    console.log('Mojojo was toggled!');
    //atom.workspace.paneForURI("mojojo.js");
    var preview = this.previewPane();
    console.log(preview);
    /*while (preview.getItems().length>0) {
      var currentitems = preview.getItems();
      var previouspane = penultimatePane();
      preview.moveItemToPane(currentitems[0],previouspane,previouspane.getItems().length);
    }*/
    preview.addItem(this.mojojoView);
    /*preview.onDidAddItem(function(event)
    {
        console.log(event)
        var newitem = event.item;
        var previouspane = penultimatePane();
        //preview.moveItemToPane(newitem,previouspane,previouspane.getItems().length);
    });*/
    return true;
  /*  return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );*/
  }

};
