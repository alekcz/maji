'use babel';

export default class MojojoView {

  constructor(port) {
    // Create root element
    if(port===null) port = "44444";
    this.element = document.createElement('div');
    this.element.classList.add('mojojo');

    const phone = document.createElement('div')
    phone.id = "main";
    this.element.appendChild(phone);
    const frame = document.createElement('iframe');
    frame.src = "http://127.0.0.1:"+port+"/";
    frame.width = "375px";
    frame.height = "667px";
    frame.id = "screen";
    phone.appendChild(frame);


  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    this.element.remove();
  }
  getTitle(){
    return "Mojojo";
  }
  getElement() {
    return this.element;
  }

}
