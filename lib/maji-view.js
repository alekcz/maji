'use babel';

export default class MajiView {

  constructor(port) {

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


    this.path = atom.project.getPaths()[0];
    if(port===null) this.port = "44444";
    else this.port = port;
    if(this.path.indexOf(".framer")<=-1)
    {
      this.element = document.createElement('div');
      this.element.classList.add('maji');

      this.phone = document.createElement('div')
      this.phone.id = "main";
      this.element.appendChild(this.phone);
    }
    else
    {
      this.element = document.createElement('div');
      this.element.classList.add('framer');
      this.element.id = "framer"
    }
    const preview = document.createElement('a');
    preview.href = "http://localhost:"+this.port+"/";
    preview.innerHTML = "View in <br/>Browser"
    preview.target = "_blank";
    preview.style.position = "fixed";
    preview.style.top = "calc(40vh - 30px)";
    preview.style.right = "-40px";
    preview.style.textAlign = "center";
    preview.style.fontSize = "20px";
    //this.element.appendChild(preview);

  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    this.element.remove();
  }
  getTitle(){
    return "Maji Studio";
  }
  getElement() {
    return this.element;
  }
  showQRcode(data) {
    var main = document.body;//.getElementById('main')
    let img = document.createElement('img');
    img.src = data;
    img.width = "375";
    img.height = "375";
    img.id = "qrcode";
    img.onclick = function(e) { this.parentNode.removeChild(this) };
    main.prepend(img);
  }
  loadContent()
  {
      let _this = this;
      setTimeout(function ()
      {
        if(_this.path.indexOf(".framer")<=-1)
        {
          const frame = document.createElement('iframe');
          frame.src = "http://127.0.0.1:"+_this.port+"/";
          frame.width = "375px";
          frame.height = "667px";
          frame.id = "screen";
          _this.phone.appendChild(frame);

        }
        else
        {
          var width = document.getElementById('framer').offsetWidth;
          var height = document.getElementById('framer').offsetHeight;
          var scale = 1 / window.devicePixelRatio;

          const frame = document.createElement('iframe');
          frame.src = "http://127.0.0.1:"+_this.port+"/";
          frame.width = width+"px";
          frame.height = height+"px";
          frame.id = "screen";
          _this.element.appendChild(frame);
        }
      }, 2000);//wait for server to start


  }
}
