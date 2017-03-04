'use babel';

export default class MajiView {

  constructor(port) {
    // Create root element
    /**
 * Creates a read/writable property which returns a function set for write/set (assignment)
 * and read/get access on a variable
 *
 * @param {Any} value initial value of the property
 */
  function createProperty(value) {
      var _value = value;

      /**
       * Overwrite getter.
       *
       * @returns {Any} The Value.
       * @private
       */
      function _get() {
          return _value;
      }

      /**
       * Overwrite setter.
       *
       * @param {Any} v   Sets the value.
       * @private
       */
      function _set(v) {
          _value = v;
      }

      return {
          "get": _get,
          "set": _set
      };
  };

  /**
   * Creates or replaces a read-write-property in a given scope object, especially for non-writable properties.
   * This also works for built-in host objects (non-DOM objects), e.g. navigator.
   * Optional an initial value can be passed, otherwise the current value of the object-property will be set.
   *
   * @param {Object} objBase  e.g. window
   * @param {String} objScopeName    e.g. "navigator"
   * @param {String} propName    e.g. "userAgent"
   * @param {Any} initValue (optional)   e.g. window.navigator.userAgent
   */
  function makePropertyWritable(objBase, objScopeName, propName, initValue) {
      var newProp,
          initObj;

      if (objBase && objScopeName in objBase && propName in objBase[objScopeName]) {
          if(typeof initValue === "undefined") {
              initValue = objBase[objScopeName][propName];
          }

          newProp = createProperty(initValue);

          try {
              Object.defineProperty(objBase[objScopeName], propName, newProp);
          } catch (e) {
              initObj = {};
              initObj[propName] = newProp;
              try {
                  objBase[objScopeName] = Object.create(objBase[objScopeName], initObj);
              } catch(e) {
                  // Workaround, but necessary to overwrite native host objects
              }
          }
      }
  };

    makePropertyWritable(window, "navigator", "userAgent");
    makePropertyWritable(window, "navigator", "platform");
    makePropertyWritable(window, "navigator", "standalone");
    window.navigator.userAgent = "Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25";
    window.navigator.platform = "iPhone";
    window.navigator.standalone = true;
    console.log(window.navigator.userAgent);
    if(port===null) port = "44444";
    this.element = document.createElement('div');
    this.element.classList.add('maji');

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
    return "Maji";
  }
  getElement() {
    return this.element;
  }

}
