//useFramer();
useFramerWithCoffee()
//useMojs();

//Feel free to delete everything below

if(getEngine()=="Mojs")
{
  const circle = new mojs.Shape({
    shape:        'circle',
    scale:        { 0 : 1 },
    fill:         { 'cyan': 'yellow' },
    radius:       100,
    y:            -340,
    x:            0,
    duration:     2000,
    repeat:       999,
  }).play();


  const rect = new mojs.Shape({
    shape:        'rect',
    fill:         'none',
    radius:       80,
    stroke:       { 'rgba(0,255,255, 1)' : 'magenta' },
    strokeWidth:  { 10: 0 },
    strokeDasharray: '100%',
    strokeDashoffset: { '-100%' : '100%' },
    angle:        { 0: 180 },

    duration:     2000,
    repeat:       999,
  }).play();


  const polygon = new mojs.Shape({
    shape:        'polygon',
    points:       5,
    fill:         { 'deeppink' : '#00F87F' },
    x:            { [-175] : 175  },
    angle:        { 0: 360 },
    radius:       100,
    y:            340,
    duration:     1000,
    repeat:       999,
  }).play();
}
else if(getEngine()=="Framer")
{
  var layerA, layerB, layerC;

  layerA = new Layer({
    width: 80,
    height: 80,
    backgroundColor: "#7ed6ff",
    borderRadius: "4px"
  });



  layerA.animate({
    properties: {
      y: 300
    }
  });



  layerB = new Layer({
    width: 80,
    height: 80,
    x: 100,
    backgroundColor: "#26b4f6",
    borderRadius: "4px"
  });

  layerB.animate({
    properties: {
      y: 300,
      rotationZ: 360
    },


    time: 2
  });



  layerC = new Layer({
    width: 80,
    height: 80,
    x: 200,
    backgroundColor: "#0079c6",
    borderRadius: "4px"
  });

  layerC.animate({
    properties: {
      y: 300
    },
    time: 3,
    curve: "cubic-bezier"
  });

}
