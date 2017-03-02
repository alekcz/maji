'use babel';

export default class MojojoView {

  constructor(serializedState) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('mojojo');
    //this.element.style.backgroundColor = "#fff"
    console.log(this.element)
    // Create message element
    const phone = document.createElement('div')
    phone.id = "main";
    this.element.appendChild(phone);
    const frame = document.createElement('iframe');
    frame.src = "http://127.0.0.1:8080/#/";
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
