//
//
// Sprite Graphics Module for DaVinci.
//
// Based on the turtle module by Brad Miller.
//
// Dependencies:
//   jQuery
//
//

var SpriteGraphics; // the single identifier needed in the global scope

if (! SpriteGraphics) {
  SpriteGraphics = {};
}


(function () {

  var Degree2Rad = Math.PI / 180.0; // conversion factor for degrees to radians.
  var Rad2Degree = 180.0 / Math.PI; // conversion factor for radians to degrees.

  function SpriteCanvas(options) {
    this.canvasID = SpriteGraphics.defaults.canvasID;
    if (options.canvasID) {
      this.canvasID = options.canvasID;
    }

    this.canvas = document.getElementById(this.canvasID);
    this.context = this.canvas.getContext('2d');
    $(this.canvas).fadeIn();

    this.lineScale = 1.0;
    this.xptscale = 1.0;
    this.yptscale = 1.0;

    this.llx = -this.canvas.width / 2;
    this.lly = -this.canvas.height / 2;
    this.urx = this.canvas.width / 2;
    this.ury = this.canvas.height / 2;
    this.setup(this.canvas.width,this.canvas.height);
    SpriteGraphics.canvasInit = true;
    this.tlist = []

    this.timeFactor = 5;
    if (SpriteGraphics.defaults.animate) {
      this.delay = 5 * this.timeFactor;
    }
    else {
      this.delay = 0;
    }
    this.segmentLength = 10;
    this.renderCounter = 1;
    this.clearPoint = 0;
    SpriteGraphics.canvasLib[this.canvasID] = this;
    //  This can be set to false AFTER the program completes to turn off the fade out on the canvas as a result of exitonclick
    Sk.tg.fadeOnExit = true;
  }

  SpriteCanvas.prototype.setup = function(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
    this.lineScale = 1.0;
    this.xptscale = 1.0;
    this.yptscale = 1.0;

    this.llx = -this.canvas.width / 2;
    this.lly = -this.canvas.height / 2;
    this.urx = this.canvas.width / 2;
    this.ury = this.canvas.height / 2;
    this.renderCounter = 1;
    this.clearPoint = 0;
    this.timeFactor = 5;
    if (SpriteGraphics.defaults.animate) {
      this.delay = 5 * this.timeFactor;
    }
    else {
      this.delay = 0;
    }

    if (SpriteGraphics.canvasInit == false) {
      this.context.save();
      this.context.translate(this.canvas.width / 2, this.canvas.height / 2); // move 0,0 to center.
      this.context.scale(1, -1); // scaling like this flips the y axis the right way.
      SpriteGraphics.canvasInit = true;
      SpriteGraphics.eventCount = 0;
      SpriteGraphics.renderClock = 0;
      SpriteGraphics.renderTime = 0;
    }
    else {
      this.context.restore();
      this.context.translate(this.canvas.width / 2, this.canvas.height / 2); // move 0,0 to center.
      this.context.scale(1, -1); // scaling like this flips the y axis the right way.
      this.context.clearRect(-this.canvas.width / 2, -this.canvas.height / 2, this.canvas.width, this.canvas.height);
    }
  }

  SpriteCanvas.prototype.addToCanvas = function(t) {
    this.tlist.push(t);
  }

  SpriteCanvas.prototype.onCanvas = function(t) {
    return (this.tlist.indexOf(t) >= 0);
  }

  SpriteCanvas.prototype.isAnimating = function() {
    return (this.tlist.length > 0);
  }

  SpriteCanvas.prototype.startAnimating = function(t) {
    if (! this.isAnimating()) {
      this.intervalId = setTimeout(render, this.delay);
    }
    // Added in case startAnimating is called after it's already been added.
    if (!this.onCanvas(t)) {
      this.addToCanvas(t);
    }
    Sk.isSpriteProgram = true;
  }

  SpriteCanvas.prototype.doneAnimating = function(t) {
    this.tlist.splice(0,this.tlist.length);
    clearTimeout(this.intervalId);
    $(Sk.runButton).removeAttr('disabled');
  }

  SpriteCanvas.prototype.cancelAnimation = function() {
    if (this.intervalId) {
      clearTimeout(this.intervalId);
    }

    for (var t in this.tlist) {
      this.tlist[t].aCount = this.tlist[t].drawingEvents.length - 1;
    }
    render();
  }

  SpriteCanvas.prototype.setSpeedDelay = function(s) {
    var df = 10 - (s % 11) + 1;
    this.delay = df * this.timeFactor;
  }

  SpriteCanvas.prototype.setDelay = function(d) {
    this.delay = d;
  }

  SpriteCanvas.prototype.getDelay = function(s) {
    return this.delay;
  }

  SpriteCanvas.prototype.setCounter = function(s) {
    if (!s || s <= 0) {
      s = 1;
    }
    this.renderCounter = s;
  }

  SpriteCanvas.prototype.getCounter = function() {
    return this.renderCounter;
  }

  SpriteCanvas.prototype.setworldcoordinates = function(llx, lly, urx, ury) {
    this.context.restore();
    this.context.scale(this.canvas.width / (urx - llx), -this.canvas.height / (ury - lly));
    if (lly == 0) {
      this.context.translate(-llx, lly - (ury - lly));
    }
    else if (lly > 0) {
      this.context.translate(-llx, -lly * 2);
    }
    else {
      this.context.translate(-llx, -ury);
    }

    var xlinescale = (urx - llx) / this.canvas.width;
    var ylinescale = (ury - lly) / this.canvas.height;
    this.xptscale = xlinescale;
    this.yptscale = ylinescale;
    this.lineScale = Math.min(xlinescale,ylinescale);
    this.context.save();

    this.llx = llx;
    this.lly = lly;
    this.urx = urx;
    this.ury = ury;

  }

  SpriteCanvas.prototype.window_width = function() {
    return this.canvas.width;
  }

  SpriteCanvas.prototype.window_height = function() {
    return this.canvas.height;
  }

  SpriteCanvas.prototype.bgcolor = function(c) {
    this.background_color = c;
    $(this.canvas).css("background-color",c.v);
  }

  SpriteCanvas.prototype.setSegmentLength = function(s) {
    this.segmentLength = s;
  }

  SpriteCanvas.prototype.getSegmentLength = function() {
    return this.segmentLength;
  }

  // todo: if animating, this should be deferred until the proper time
  SpriteCanvas.prototype.exitonclick = function () {
    var canvas_id = this.canvasID;
    var theCanvas = this;
    $(this.canvas).click(function() {
      if (! theCanvas.isAnimating()) {
        if (Sk.tg.fadeOnExit) {
         $("#"+canvas_id).hide();
       }
       $("#"+canvas_id).unbind('click');
       Sk.tg.canvasInit = false;
       delete Sk.tg.canvasLib[canvas_id];
     }
   });
  }

  SpriteCanvas.prototype.sprites = function() {
    return SpriteGraphics.spriteList;
  }

 /**
  * New version NOT attached to a sprite (as per real sprite)
  */
  SpriteCanvas.prototype.tracer = function(t, d) {
    this.setCounter(t);
    if (t == 0) {
      for (var i in this.spriteList) {
        this.spriteList[i].animate = false;
      }
      this.cancelAnimation();
    }
    if (d !== undefined) {
      this.setDelay(d);
    }
  }

  // check if all sprites are done
  allDone = function() {
    var allDone = true;
    for (var tix in SpriteGraphics.spriteList) {
      var theT = SpriteGraphics.spriteList[tix];
      allDone = allDone && (theT.aCount >= theT.drawingEvents.length);
    }
    return allDone;
  }

  //
  //  This is the function that provides the animation
  //
  render = function () {
    var context = document.getElementById(SpriteGraphics.defaults.canvasID).getContext('2d');
    with (context) {
      with (SpriteGraphics.canvasLib[SpriteGraphics.defaults.canvasID]) {
        clearRect(llx, lly, (urx - llx), (ury - lly));
      }
      var incr = SpriteGraphics.canvasLib[SpriteGraphics.defaults.canvasID].getCounter();
      var lastCanvas = null;

      SpriteGraphics.renderClock += incr;

      for (var tix in SpriteGraphics.spriteList) {
        var t = SpriteGraphics.spriteList[tix]
        lastCanvas = t.spriteCanvas 
        if (t.aCount >= t.drawingEvents.length) {
          t.aCount = t.drawingEvents.length - 1;
        }
        moveTo(0, 0);
        var currentPos = new Vector(0,0,0);
        var currentHead = new Vector(1,0,0);
        lineWidth = t.get_pen_width();
        lineCap = 'round';
        lineJoin = 'round';
        strokeStyle = 'black';
        var filling = false;
        if (isNaN(t.spriteCanvas.delay)) {
          t.spriteCanvas.delay = 0
        }
        for (var i = t.clearPoint; (i <= t.aCount || t.spriteCanvas.delay == 0) && i < t.drawingEvents.length; i++) {
          if (i > t.aCount) {
            // If se jump past aCount, jump it ahead
            t.aCount = i
          }
          var oper = t.drawingEvents[i];
          var ts = oper[oper.length-1];
          if (ts <= SpriteGraphics.renderClock || t.spriteCanvas.delay == 0) {
            if (ts > SpriteGraphics.renderClock) {
              // If we go past the render clock, jump it ahead
              SpriteGraphics.renderClock = ts
            }
            if (oper[0] == "LT") {  //  line to
              if (! filling) {
                beginPath();
                moveTo(oper[1], oper[2]);
              }
              lineTo(oper[3], oper[4]);
              strokeStyle = oper[5];
              stroke();
              currentPos = new Vector(oper[3],oper[4],0);
              if (! filling)
                closePath();
            }
            else if (oper[0] == "MT") {  // move to
              moveTo(oper[3], oper[4]);
              currentPos = new Vector(oper[3],oper[4],0);
            }
            else if (oper[0] == "BF") {  // begin fill
              beginPath();
              moveTo(oper[1], oper[2]);
              filling = true;
            }
            else if (oper[0] == "EF") {  // end fill
              fillStyle = oper[3];
              stroke();
              fill();
              closePath();
              filling = false;
            }
            else if (oper[0] == "FC") {  // fill color
              fillStyle = oper[1];
            }
            else if (oper[0] == "TC") {  // sprite color
              strokeStyle = oper[1];
            }
            else if (oper[0] == "PW") {  // Pen width
              lineWidth = oper[1];
            }
            else if (oper[0] == "DT") {  // Dot
              var col = fillStyle;
              fillStyle = oper[2];
              var size = oper[1];
              fillRect(oper[3] - size / 2, oper[4] - size / 2, size, size);
              fillStyle = col;
            }
            else if (oper[0] == "CI") {  // Circle
              if (!filling)
                beginPath();
              arc(oper[1], oper[2], oper[3], oper[4], oper[5], oper[6]);
              currentPos = new Vector(oper[1]+Math.cos(oper[5])*oper[3],
                oper[2]+Math.sin(oper[5])*oper[3],0);
              stroke();
              if (! filling) {
                closePath();
              }
            }
            else if (oper[0] == "WT") { // write
              if (font)
                font = oper[2];
              scale(1, -1);
              fillText(oper[1], oper[3], -oper[4]);
              scale(1, -1);
            } else if (oper[0] == "ST") {  // stamp
              t.drawSprite(oper[3], new Vector(oper[1], oper[2], 0));
            } else if (oper[0] == "HT") { // hide sprite
              t.visible = false;
            } else if (oper[0] == "SH") { // show sprite
              t.visible = true;
            } else if (oper[0] == "TT") {
              currentHead = oper[1];
            } else if (oper[0] == "CL") { // RNL clear
              clear_canvas(t.canvasID);
              t.clearPoint = i; // Different from reset that calls clear because it leaves the sprites where they are
            } else if (oper[0] == "DL") { // RNL delay
              var df = oper[1];
              t.spriteCanvas.delay = df
            } else if (oper[0] == "SC") { // RNL speed change
              var s = oper[1]
              if (s < 0)
                s = 0
              if (s > 10)
                s = 10
              var df = (10 - (s % 11) + 1) * t.spriteCanvas.timeFactor  //  10
              if (s == 0) {
                df = 0
              }
              // t.spriteCanvas.intervalId = clearInterval(t.spriteCanvas.intervalId);
              t.spriteCanvas.delay = df;
              // t.spriteCanvas.intervalId = setInterval(render, t.spriteCanvas.delay)
              if (oper[2]) {
                t.spriteCanvas.setSegmentLength(oper[2]);
              }
            } else if (oper[0] == "NO") {
              // RNL no op
            } else {
            } // end of oper[0] test
          } // end of if ts < render clock
        } // end of for
        t.aCount += incr;
        if (t.visible) {
          // draw the sprite
          t.drawSprite(currentHead.toAngle(), currentPos); // just use currentHead
        }
      }
      // if (t.aCount >= t.drawingEvents.length) {
      if (SpriteGraphics.renderClock > SpriteGraphics.eventCount ){ // && allDone() ){
        // t.spriteCanvas.doneAnimating(t);
        if (lastCanvas) lastCanvas.doneAnimating(t);
      }
      else {
        // t.spriteCanvas.intervalId = setTimeout(render, t.spriteCanvas.delay)
        if (lastCanvas) {
          lastCanvas.intervalId = setTimeout(render, lastCanvas.delay)
        }
      }
    }
  }

  // Constructor for Sprite objects
  function Sprite() {
    if (arguments.length >= 1) {
      this.initialize(arguments[0]);
    }
    else {
      this.initialize();
    }
    SpriteGraphics.spriteList.push(this);
  }

  Sprite.prototype.go_home = function () {
    // Put sprite in initial state
    // sprite is headed to the right
    // with position 0,0,0 in the middle of the canvas.
    // x grows to the right
    // y grows towards the top of the canvas
    with (this) {
      position = home;
      context.moveTo(home[0], home[1]);
      heading = new Vector([1.0, 0.0, 0.0]); // to the right; in sprite space x+ direction
      normal = new Vector([0.0, 0.0, -1.0]); // in z- direction
    }
  };

  Sprite.prototype.initialize = function () {
    // Initialize the sprite.
    var options = { };

    if (arguments.length >= 1) {
      options = arguments[0];
    }

    this.canvasID = SpriteGraphics.defaults.canvasID;
    if (options.canvasID) {
      this.canvasID = options.canvasID;
    }
    this.context = document.getElementById(this.canvasID).getContext('2d');

    this.animate = SpriteGraphics.defaults.animate;

    with (this.context) {
      if (SpriteGraphics.canvasInit == false) {
        save();
        translate(canvas.width / 2, canvas.height / 2); // move 0,0 to center.
        scale(1, -1); // scaling like this flips the y axis the right way.
        if (! SpriteGraphics.canvasLib[this.canvasID]) {
          SpriteGraphics.canvasLib[this.canvasID] = new SpriteCanvas(options);
        }
        SpriteGraphics.canvasInit = true;
      }
      else {
        clear_canvas(this.canvasID);
      }

      this.spriteCanvas = SpriteGraphics.canvasLib[this.canvasID];
      this.home = new Vector([0.0, 0.0, 0.0]);
      this.visible = true;
      this.shapeStore = {};
      this.shapeStore['turtle'] = turtleShapePoints();
      this.shapeStore['arrow'] = defaultShapePoints();
      this.shapeStore['circle'] = circleShapePoints();
      this.shapeStore['classic'] = classicShapePoints();
      this.currentShape = 'classic';
      this.drawingEvents = [];

      this.filling = false;
      this.pen = true;
      this.penStyle = 'black';
      this.penWidth = 2;
      this.fillStyle = 'black';
      this.position = [ ];
      this.heading = [ ];
      this.normal = [ ];
      this.go_home();
      this.aCount = 0;
      this.clearPoint = 0;
    }
  }

  function turtleShapePoints() {
    var pl = [
    [0,16],
    [-2,14],
    [-1,10],
    [-4,7],
    [-7,9],
    [-9,8],
    [-6,5],
    [-7,1],
    [-5,-3],
    [-8,-6],
    [-6,-8],
    [-4,-5],
    [0,-7],
    [4,-5],
    [6,-8],
    [8,-6],
    [5,-3],
    [7,1],
    [6,5],
    [9,8],
    [7,9],
    [4,7],
    [1,10],
    [2,14]
    ];
    res = [];
    for (p in pl) {
      res.push(new Vector(pl[p]));
    }
    return res;
  }

  function defaultShapePoints() {
    var pl = [
    [-10,0],
    [10,0],
    [0,10]
    ];
    res = [];
    for (p in pl) {
      res.push(new Vector(pl[p]));
    }
    return res;
  }

  function circleShapePoints() {
    var pl = [
    [10,0],
    [9.51,3.09],
    [8.09,5.88],
    [5.88,8.09],
    [3.09,9.51],
    [0,10],
    [-3.09,9.51],
    [-5.88,8.09],
    [-8.09,5.88],
    [-9.51,3.09],
    [-10,0],
    [-9.51,-3.09],
    [-8.09,-5.88],
    [-5.88,-8.09],
    [-3.09,-9.51],
    [-0.00,-10.00],
    [3.09,-9.51],
    [5.88,-8.09],
    [8.09,-5.88],
    [9.51,-3.09]
    ];
    res = [];
    for (p in pl) {
      res.push(new Vector(pl[p]));
    }
    return res;
  }

  function classicShapePoints() {
    var pl = [
    [0,0],
    [-5,-9],
    [0,-7],
    [5,-9]
    ];
    res = [];
    for (p in pl) {
      res.push(new Vector(pl[p]));
    }
    return res;
  }

  Sprite.prototype.clean = function () {
    // Clean the canvas
    // Optional second argument is color
    with (this) {
      if (arguments.length >= 1) {
        clear_canvas(canvasID, arguments[0]);
      }
      else {
        clear_canvas(canvasID);
      }
      initialize();
    }
  }

  Sprite.prototype.addDrawingEvent = function(eventList) {
    SpriteGraphics.eventCount += 1;
    eventList.push(SpriteGraphics.eventCount);
    this.drawingEvents.push(eventList);
  }

  //  
  //  Drawing Functions
  //

    // break a line into segments
    // sp:  Vector of starting position
    // ep:  Vector of ending position
    // sl:  int length of segments
    segmentLine = function(sp, ep, sL, pen) {
      var head = ep.sub(sp).normalize();
      var numSegs = Math.floor(ep.sub(sp).len() / sL);
      var res = [];
      var oldp = sp;
      var newp;
      var op = ""
      if (pen)
        op = "LT"
      else
        op = "MT"
      for (var i = 0; i < numSegs; i++) {
        newp = oldp.linear(1, sL, head);
        res.push([op,oldp[0],oldp[1],newp[0],newp[1]]);
        oldp = newp;
      }
      if (! ((oldp[0] == ep[0]) && (oldp[1] == ep[1])))
        res.push([op, oldp[0], oldp[1], ep[0], ep[1]]);
      return res;
    }

    Sprite.prototype.draw_line = function(newposition) {
      with (this) {
        with (context) {
          if (! animate) {
            if (! filling) {
              beginPath();
              moveTo(position[0], position[1]);
            }
            lineCap = 'round';
            lineJoin = 'round';
            lineWidth = get_pen_width();
            strokeStyle = penStyle;
            lineTo(newposition[0], newposition[1]);
            stroke();
            if (! filling)
              closePath();
          } else {
            var r = segmentLine(position, newposition, spriteCanvas.getSegmentLength(), pen);
            for (var s in r) {
              r[s].push(penStyle);
              addDrawingEvent(r[s]);
            }
            if (! spriteCanvas.isAnimating()) {
              spriteCanvas.startAnimating(this);
            } else {
              if (! spriteCanvas.onCanvas(this))
                spriteCanvas.addToCanvas(this);
            }
          }
        }
      }
    }

    Sprite.prototype.forward = function (d) {
      with (this) {
        var newposition = position.linear(1, d, heading);
        goto(newposition);
      }
    }

    Sprite.prototype.backward = function(d) {
      this.forward(-d);
    }

    // This is an internal function that sets the position without doing any drawing
    Sprite.prototype.teleport_to = function(nx, ny) {
      if (nx instanceof Vector)
        var newposition = nx;
      else
        var newposition = new Vector([nx,ny,0]);
      this.context.moveTo(newposition[0], newposition[1]);
      this.position = newposition;
    }

    Sprite.prototype.goto = function(nx, ny) {
      if (nx instanceof Vector)
        var newposition = nx;
      else
        var newposition = new Vector([nx,ny,0]);
      with (this) {
        if (pen) {
          draw_line(newposition);
        } else {
          if (! animate) {
            context.moveTo(newposition[0], newposition[1]);
          } else {
            var r = segmentLine(position, newposition, spriteCanvas.getSegmentLength(), pen);
            for (var s in r)
              addDrawingEvent(r[s]);
            if (! spriteCanvas.isAnimating()) {
              spriteCanvas.startAnimating(this);
            } else {
              if (! spriteCanvas.onCanvas(this))
                spriteCanvas.addToCanvas(this);
            }
          }
        }
        position = newposition;
      }
    }

    Sprite.prototype.delay = function(d) {
      if (d != null) {
        if (d < 0) {
          d = -d;
        }
        if (!this.animate) {
          this.spriteCanvas.setDelay(d);
        } 
        else {
          this.spriteCanvas.setDelay(d);
          this.addDrawingEvent(["DL", d]);
          this.addDrawingEvent(["NO"]);
        }
      }
      return this.spriteCanvas.getDelay();
    }

    Sprite.prototype.speed = function(s,t) {
      if (s > 0 && !this.animate) {
        this.animate = true;
        this.spriteCanvas.setSpeedDelay(s);
      }
      else if (s == 0 && !this.animate) {
        this.spriteCanvas.setSpeedDelay(s);
      }
      else {
        // this.animate = false;
        // this.spriteCanvas.cancelAnimation();
        this.addDrawingEvent(["SC", s, t]);
        this.addDrawingEvent(["NO"]);
      }
      if (t) {
        this.spriteCanvas.setSegmentLength(t);
        // set the number of units to divide a segment into
      }
      else {
        this.spriteCanvas.setSegmentLength(10);
      }
    }

    Sprite.prototype.tracer = function(t, d) {
      this.spriteCanvas.setCounter(t);
      if (t == 0) {
       this.animate=false;
       this.spriteCanvas.cancelAnimation();
     }
     if (d !== undefined)
       this.spriteCanvas.setDelay(d);
   }

   Sprite.prototype.getRenderCounter = function() {
    return this.spriteCanvas.getCounter();
  }

  Sprite.prototype.turn = function (phi) {
    with (this) {
      var alpha = phi * Degree2Rad;
      var left = normal.cross(heading);
      var newheading = heading.rotateNormal(left, normal, alpha);
      heading = newheading;

      if (animate) {
        addDrawingEvent(["TT",heading]);
      }
    }
  }

  Sprite.prototype.right = Sprite.prototype.turn;

  Sprite.prototype.left = function(phi) {
    this.turn(-phi);
  }

  Sprite.prototype.get_heading = function () {
    if (SpriteGraphics.defaults.degrees)
      return this.heading.toAngle()
    else
      return this.heading
  }

  Sprite.prototype.get_position = function () {
    return this.position;
  }

  Sprite.prototype.getx = function () {
    return this.position[0];
  }

  Sprite.prototype.gety = function () {
    return this.position[1];
  }

  Sprite.prototype.set_heading = function(newhead) {
    if ((typeof(newhead)).toLowerCase() === 'number') {
      this.heading = Vector.angle2vec(newhead);
    } else {
      this.heading = newhead;
    }
  }

  Sprite.prototype.towards = function(to, y) {
    // set heading vector to point towards another point.
    if ((typeof(to)).toLowerCase() === 'number')
      to = new Vector(to, y, 0);
    else if (! (to instanceof Vector)) {
      to = new Vector(to);
    }
    var res = to.sub(this.position);
    res = res.normalize();
    if (SpriteGraphics.defaults.degrees)
      return res.toAngle();
    else
      return res;
  }

  Sprite.prototype.distance = function(to, y) {
    if ((typeof(to)).toLowerCase() === 'number')
      to = new Vector(to, y, 0);
    return this.position.sub(new Vector(to)).len();
  }

  Sprite.prototype.dot = function() {
    var size = 2;
    if (arguments.length >= 1) size = arguments[0];
    size = size * this.spriteCanvas.lineScale;
    with (this) {
      with (context) {
        var color = penStyle;
        var nc = arguments[1] || color;
        if (! animate) {
          fillStyle = nc;
          fillRect(position[0] - size / 2, position[1] - size / 2, size, size);
          fillStyle = color;
        } else {
          addDrawingEvent(["DT", size, nc, position[0], position[1]]);
        }
      }
    }
  }

  Sprite.prototype.circle = function(radius, extent) {
    if (extent === undefined) {
      extent = 360
    }
    if (this.animate) {
     var arcLen = Math.abs(radius * Math.PI * 2.0  * extent / 360);
     var segLen = this.spriteCanvas.getSegmentLength();
     if (arcLen <= segLen)
      this.arc(radius,extent);
    else {
        //  Break the arc into segments for animation
        var extentPart = (segLen / arcLen) * extent;
        var extentLeft = extent;
        while (Math.abs(extentLeft) > Math.abs(extentPart)) {
          this.arc(radius, extentPart);
          extentLeft = extentLeft - extentPart;
        }
        if (Math.abs(extentLeft) > 0.01)
          this.arc(radius, extentLeft);
      }
    } else {
      this.arc(radius,extent);
    }
  }
  
  Sprite.prototype.arc = function(radius, extent) {
    //  Figure out where the sprite is and which way it's facing
    var spriteHeading = this.get_heading()
    var tx = this.position[0]
    var ty = this.position[1]

    //  Figure out the circle center
    var cx = tx + (radius * Math.cos((spriteHeading + 90) * Degree2Rad));
    var cy = ty + (radius * Math.sin((spriteHeading + 90) * Degree2Rad));

    //  Canvas arc angles go CLOCKWISE, not COUNTERCLOCKWISE like Sprite

    //  Figure out our arc angles
    var startAngleDeg;
    if (radius >= 0)
      startAngleDeg = spriteHeading - 90;
    else
      startAngleDeg = spriteHeading + 90;

    var endAngleDeg;
    if (extent) {
      if (radius >= 0)
        endAngleDeg = startAngleDeg + extent;
      else
        endAngleDeg = startAngleDeg - extent;
    }
    else {
      if (radius >= 0)
        endAngleDeg = startAngleDeg + 360;
      else
        endAngleDeg = startAngleDeg - 360;
    }

    //  Canvas angles are opposite
    startAngleDeg = 360 - startAngleDeg
    endAngleDeg   = 360 - endAngleDeg

    //  Becuase the y axis has been flipped in HTML5 Canvas with a tanslation, we need to adjust the angles
    startAngleDeg = -startAngleDeg
    endAngleDeg   = -endAngleDeg

    //  Convert to radians
    var startAngle = startAngleDeg * Degree2Rad;
    var endAngle   = endAngleDeg   * Degree2Rad;


    //  Do the drawing
    if (! this.animate) {
      if (!this.filling)
        this.context.beginPath();
      this.context.arc(cx, cy, Math.abs(radius), startAngle, endAngle, (radius * extent <= 0));
      this.context.stroke();
      if (!this.filling)
        this.context.closePath();
    }
    else {
      this.addDrawingEvent(["CI", cx, cy, Math.abs(radius), startAngle, endAngle, (radius * extent <= 0)]);
    }

    //  Move the sprite only if we have to
    if (extent && (extent % 360) != 0) {
      var turtleArc;
      if (radius >= 0)
        turtleArc = extent;
      else 
        turtleArc = -extent;
      var newHeading = (spriteHeading + turtleArc) % 360;
      if (newHeading < 0)
        newHeading = newHeading + 360;

      var nx = cx + (radius * Math.cos((newHeading - 90) * Degree2Rad));
      var ny = cy + (radius * Math.sin((newHeading - 90) * Degree2Rad));  //  y coord is inverted in sprite

      //  Move it internally
      this.set_heading(newHeading);
      this.teleport_to(nx,ny);

      //  If we're animating the sprite, move it on the screen
      if (this.animate) {
        this.addDrawingEvent(["TT", this.heading]);
      }
    }
  }

  Sprite.prototype.write = function(theText, move, align, font) {
    if (! this.animate) {
      if (font)
        this.context.font = font.v;
      this.context.scale(1, -1);
      this.context.fillText(theText, this.position[0], -this.position[1]);
      this.context.scale(1, -1);
    } else {
      var fontspec;
      if (font)
        fontspec = font.v
      this.addDrawingEvent(["WT", theText, fontspec, this.position[0], this.position[1]]);
    }
  }

  Sprite.prototype.setworldcoordinates = function(llx, lly, urx, ury) {
    this.spriteCanvas.setworldcoordinates(llx, lly, urx, ury);
  }

  //
  // Pen and Style functions
  //
  Sprite.prototype.pen_down = function () {
    this.pen = true;
  }

  Sprite.prototype.down = Sprite.prototype.pen_down;

  Sprite.prototype.pen_up = function () {
    this.pen = false;
  }

  Sprite.prototype.up = Sprite.prototype.pen_up;

  Sprite.prototype.get_pen = function () {
    return this.pen;
  }

  Sprite.prototype.set_pen_width = function (w) {
    if (this.animate)
      this.addDrawingEvent(["PW", w * this.spriteCanvas.lineScale]);
    else
      this.penWidth = w;
  }

  Sprite.prototype.get_pen_width = function() {
    return this.penWidth * this.spriteCanvas.lineScale;
  }

  Sprite.prototype.set_pen_color = function (c, g, b) {
    if (typeof(c) == "string") {
      this.penStyle = c;
    }
    else {
      var rs
      var gs
      var bs
      if (typeof( c) == "object" && c.length == 3) {
        var c0 = Sk.builtin.asnum$(c[0]);
        var c1 = Sk.builtin.asnum$(c[1]);
        var c2 = Sk.builtin.asnum$(c[2]);
      }
      else {
        var c0 = Sk.builtin.asnum$(c);
        var c1 = Sk.builtin.asnum$(g);
        var c2 = Sk.builtin.asnum$(b);
      }
      rs = c0.toString(16);
      gs = c1.toString(16);
      bs = c2.toString(16);
      while (rs.length < 2) rs = "0" + rs;
      while (gs.length < 2) gs = "0" + gs;
      while (bs.length < 2) bs = "0" + bs;
      c = "#" + rs + gs + bs;
      this.penStyle = c;
    }

    this.context.strokeStyle = c;
    if (this.animate)
      this.addDrawingEvent(["TC", c]);
  }

  Sprite.prototype.set_fill_color = function (c, g, b) {
    if (typeof(c) == "string") {
      this.fillStyle = c;
    }
    else {
      var rs
      var gs
      var bs
      if (typeof( c) == "object" && c.length == 3) {
        var c0 = Sk.builtin.asnum$(c[0]);
        var c1 = Sk.builtin.asnum$(c[1]);
        var c2 = Sk.builtin.asnum$(c[2]);
      } else {
        var c0 = Sk.builtin.asnum$(c);
        var c1 = Sk.builtin.asnum$(g);
        var c2 = Sk.builtin.asnum$(b);
      }
      rs = c0.toString(16)
      gs = c1.toString(16)
      bs = c2.toString(16)
      while (rs.length < 2) rs = "0" + rs;
      while (gs.length < 2) gs = "0" + gs;
      while (bs.length < 2) bs = "0" + bs;
      c = "#" + rs + gs + bs;
      this.fillStyle = c;
    }

    this.context.fillStyle = c;
    if (this.animate)
      this.addDrawingEvent(["FC", c]);
  }

  Sprite.prototype.begin_fill = function () {
    if (! this.animate) {
      this.filling = true;
      this.context.beginPath();
      this.context.moveTo(this.position[0], this.position[1]);
    }
    else {
      this.addDrawingEvent(["BF", this.position[0], this.position[1]]);
    }
  }

  Sprite.prototype.end_fill = function () {
    if (! this.animate) {
      this.context.stroke();
      this.context.fill();
      this.context.closePath();
      this.filling = false;
    } else
    this.addDrawingEvent(["EF", this.position[0], this.position[1], this.fillStyle]);
  }

  Sprite.prototype.showturtle = function() {
    if (this.animate) {
      this.addDrawingEvent(["SH"]);
    }
    this.visible = true;
  }

  Sprite.prototype.hideturtle = function() {
    if (this.animate) {
      this.addDrawingEvent(["HT"]);
    }
    this.visible = false;
  }

  Sprite.prototype.isvisible = function() {
    return this.visible;
  }

  // 
  // Appearance
  //

  Sprite.prototype.shape = function(s) {
    if (this.shapeStore[s])
      this.currentShape = s;
    else {
    }
  }

  Sprite.prototype.drawSprite = function(heading, position) {
    var rtPoints = [];
    var plist = this.shapeStore[this.currentShape];
    var head;
    if (! (heading === undefined))
      head = heading - 90.0;
    else
      head = this.heading.toAngle() - 90.0;
    if (! position)
      position = this.position
    for (p in plist) {
      rtPoints.push(plist[p].scale(this.spriteCanvas.xptscale,this.spriteCanvas.yptscale).rotate(head).add(position));
    }
    this.context.beginPath();
    this.context.moveTo(rtPoints[0][0], rtPoints[0][1]);
    for (var i = 1; i < rtPoints.length; i++) {
      this.context.lineTo(rtPoints[i][0], rtPoints[i][1]);
    }
    this.context.closePath();
    this.context.stroke();
    if (this.fillStyle) {
      this.context.fill();
    }
  }

  Sprite.prototype.stamp = function() {
    // either call drawSprite or just add a DT with current position and heading to the drawingEvents list.
    if (this.animate) {
      this.addDrawingEvent(["ST",this.position[0],this.position[1],this.heading.toAngle()]);
    } else
    this.drawSprite();
  }

  Sprite.prototype.clear = function () {
    if (this.animate) {
      this.addDrawingEvent(["CL"])
    }
    else {
      clear_canvas(this.canvasID);
    }
  }

  function clear_canvas(canId) {
    with (document.getElementById(canId).getContext('2d')) {
      if (arguments.length >= 2) {
        // fillStyle = arguments[1];
        // fillRect(0, 0, canvas.width, canvas.height);
      }
      clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
    }
  }


  // Create a 3d Vector class for manipulating sprite heading, and position.

  function Vector(x, y, z) {
    if ((typeof(x)).toLowerCase() === 'number') {
      Array.prototype.push.call(this, x);
      Array.prototype.push.call(this, y);
      Array.prototype.push.call(this, z);
    }
    else {
      for (var i in x) {
        Array.prototype.push.call(this, x[i]);
      }
    }
  }


  // Create a vector object given a direction as an angle.
  Vector.angle2vec = function(phi) {
    var res = new Vector([0.0,0.0,0.0]);
    phi = phi * Degree2Rad;
    res[0] = Math.cos(phi);
    res[1] = Math.sin(phi);
    return res.normalize();
  }

  // This trick allows you to access a Vector object like an array
  // myVec[0] == x
  // myVec[1] == y
  // myVec[2] == z
  // we really only need the z for the convenience of rotating!
  // If we were using Geometric Algebra we wouldn't need it at all and could stay in the plane.
  Vector.prototype.addItem = function(item) {
    Array.prototype.push.call(this, item);
  }

  Vector.prototype.linear = function(a, b, v) {
    var result = [ ];
    for (var c = 0; c <= 2; ++c) {
      result[c] = a * this[c] + b * v[c];
    }
    return new Vector(result);
  }

  Vector.prototype.cross = function(v) {
    // Return cross product of this and v
    var result = [ ];
    for (var c = 0; c <= 2; ++c) {
      result[c] = this[(c + 1) % 3] * v[(c + 2) % 3] - this[(c + 2) % 3] * v[(c + 1) % 3];
    }
    return new Vector(result);
  }

  Vector.prototype.rotate = function(angle) {
    // Rotate this counter clockwise by angle.
    var perp = new Vector(-this[1], this[0], 0);
    angle = angle * Degree2Rad;
    var c = Math.cos(angle);
    var s = Math.sin(angle);
    return new Vector(this[0] * c + perp[0] * s, this[1] * c + perp[1] * s, 0);
  }

  Vector.prototype.rotateNormal = function(v, w, alpha) {
    // Return rotation of this in direction of v about w over alpha
    // Requires: v, w are vectors; alpha is angle in radians
    //   this, v, w are orthonormal
    return this.linear(Math.cos(alpha), Math.sin(alpha), v);
  }

  Vector.prototype.normalize = function() {
    var n = this.len();
    var res = this.div(n);
    return res;
  }

  Vector.prototype.toAngle = function() {
    // workaround for values getting set to +/i xxx e -16 fooling the +/- checks below
    if (Math.abs(this[1]) < 0.00001) this[1] = 0.0;
    if (Math.abs(this[0]) < 0.00001) this[0] = 0.0;
    var rads = Math.atan(Math.abs(this[1]) / Math.abs(this[0]));
    var deg = rads * Rad2Degree;
    if (this[0] < 0 && this[1] > 0) deg = 180 - deg;
    else if (this[0] < 0 && this[1] <= 0) deg = 180.0 + deg;
    else if (this[0] >= 0 && this[1] < 0) deg = 360 - deg;
    return deg;
  }

  // divide all vector components by the same value
  Vector.prototype.div = function(n) {
    res = []
    res[0] = this[0] / n;
    res[1] = this[1] / n;
    res[2] = this[2] / n;
    return new Vector(res);
  }

  // subtract one vector from another
  Vector.prototype.sub = function(v) {
    res = new Vector(0, 0, 0);
    res[0] = this[0] - v[0];
    res[1] = this[1] - v[1];
    res[2] = this[2] - v[2];
    return res;
  }

  Vector.prototype.add = function(v) {
    res = new Vector(0, 0, 0);
    res[0] = this[0] + v[0];
    res[1] = this[1] + v[1];
    res[2] = this[2] + v[2];
    return res;
  }

  Vector.prototype.smul = function(k) {  // scalar multiplication
    res = new Vector(0, 0, 0);
    res[0] = this[0] * k;
    res[1] = this[1] * k;
    res[2] = this[2] * k;
    return res;
  }

  Vector.prototype.scale = function(xs,ys) {
    res = new Vector(0,0,0);
    res[0] =  this[0] * ys;
    res[1] =  this[1] * xs;
    res[2] = 1.0;
    return res;
  }

  Vector.prototype.len = function() {
    return Math.sqrt(this[0] * this[0] + this[1] * this[1] + this[2] * this[2]);
  }

  SpriteGraphics.defaults = {canvasID: 'mycanvas', degrees: true, animate: true};
  SpriteGraphics.spriteList = [];
  SpriteGraphics.Sprite = Sprite;
  SpriteGraphics.SpriteCanvas = SpriteCanvas;
  SpriteGraphics.canvasLib = {};
  SpriteGraphics.clear_canvas = clear_canvas;
  SpriteGraphics.Vector = Vector;
  SpriteGraphics.canvasInit = false;
  SpriteGraphics.eventCount = 0;
  SpriteGraphics.renderClock = 0;
  SpriteGraphics.renderTime  = 0;

})();

var $builtinmodule = function(name) {

  var mod = {};

  Sk.builtin.defineEuclidean2(mod);
  Sk.builtin.defineUnits(mod);

  // The exported name of the SPRITE class.
  var SPRITE = "Sprite";

  // First we create an object, this will end up being the class
  Sk.tg = SpriteGraphics;

  var checkArgs = function(expected, actual, func) {
    if (actual != expected ) {
      throw new Sk.builtin.TypeError(func + " takes exactly " + expected + " positional argument (" + actual + " given)");
    }
  }

  var sprite = function($gbl, $loc) {

    $loc.__init__ = new Sk.builtin.func(function(self, options) {
      SpriteGraphics.defaults = {"canvasID": Sk.canvas, "animate": true, "degrees": true};
      self.skType = SPRITE;
      self.tp$name = SPRITE;
      self.v = new SpriteGraphics.Sprite();
      if (options instanceof Sk.builtin.dict) {
        for (var iter = options.tp$iter(), k = iter.tp$iternext(); k !== undefined; k = iter.tp$iternext()) {
          var v = options.mp$subscript(k);
          if (v === undefined) {
            v = null;
          }
          var kAsJs = Sk.ffi.remapToJs(k);
          var vAsJs = Sk.ffi.remapToJs(v);
          Sk.misceval.callsim(self['__setattr__'], self, kAsJs, v);
        }
      }
    });

    $loc.__getattr__ = new Sk.builtin.func(function(self, key) {

      var BACKWARD = "backward";
      var BEGIN_FILL = "begin_fill";
      // color is implemented as a callable attribute for compatibility.
      var COLOR = "color";
      var DOWN = "down";
      var END_FILL = "end_fill";
      // FILL_COLOR is implemented as a callable attribute for backwcompatibility.
      var FILL_COLOR = "fillcolor";
      var FORWARD = "forward";
      var GOTO = "goto";
      var LEFT = "left";
      var POSITION = "position";
      var RIGHT = "right";
      // shape is implemented as a callable attribute for compatibility.
      var SHAPE = "shape";
      var STAMP = "stamp";
      var UP = "up";
      // Capture the target of the attribute operation.
      var target = self.v;

      switch(key) {
        case BACKWARD: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {

            $loc.__init__ = new Sk.builtin.func(function(self) {
              self.tp$name = BACKWARD;
            });

            $loc.__call__ = new Sk.builtin.func(function(self, distance) {
              distance = Sk.builtin.asnum$(distance);
              checkArgs(2, arguments.length, BACKWARD);
              target.forward(-distance);
            });

            $loc.__str__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(BACKWARD)
            })

            $loc.__repr__ = new Sk.builtin.func(function(self, arg) {
              return new Sk.builtin.str(BACKWARD)
            })

          }, BACKWARD, []));
        }
        case BEGIN_FILL: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {

            $loc.__init__ = new Sk.builtin.func(function(self) {
              self.tp$name = BEGIN_FILL;
            });

            $loc.__call__ = new Sk.builtin.func(function(self) {
              checkArgs(1, arguments.length, BEGIN_FILL);
              target.begin_fill();
            });

            $loc.__str__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(BEGIN_FILL)
            })

            $loc.__repr__ = new Sk.builtin.func(function(self, arg) {
              return new Sk.builtin.str(BEGIN_FILL)
            })

          }, BEGIN_FILL, []));
        }
        case COLOR: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {

            $loc.__init__ = new Sk.builtin.func(function(self) {
              self.tp$name = COLOR;
            });

            $loc.__call__ = new Sk.builtin.func(function(self, color, green, blue) {
              if(color) {
                if (blue) {
                  target.set_pen_color(color, green, blue);
                  target.set_fill_color(color, green, blue);
                }
                else {
                  color = color.v || target.context.fillStyle;
                  target.set_pen_color(color);
                  target.set_fill_color(color);
                }
              }
              else {
                return [target.penStyle, target.fillStyle];
              }
            });

            $loc.__str__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(COLOR)
            })

            $loc.__repr__ = new Sk.builtin.func(function(self, arg) {
              return new Sk.builtin.str(COLOR)
            })

          }, COLOR, []));
        }
        case DOWN: {
          return Sk.ffi.callableToPy(mod, target, DOWN, function(self) {
            Sk.ffi.checkMethodArgs(DOWN, arguments, 0, 0);
            target.pen_down();
          });
        }
        case END_FILL: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {

            $loc.__init__ = new Sk.builtin.func(function(self) {
              self.tp$name = END_FILL;
            });

            $loc.__call__ = new Sk.builtin.func(function(self) {
              checkArgs(1, arguments.length, END_FILL);
              target.end_fill();
            });

            $loc.__str__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(END_FILL)
            })

            $loc.__repr__ = new Sk.builtin.func(function(self, arg) {
              return new Sk.builtin.str(END_FILL)
            })

          }, END_FILL, []));
        }
        case FILL_COLOR: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {

            $loc.__init__ = new Sk.builtin.func(function(self) {
              self.tp$name = FILL_COLOR;
            });

            $loc.__call__ = new Sk.builtin.func(function(self, color, green, blue) {
              if (color) {
                if (blue) {
                  target.set_fill_color(color, green, blue);
                }
                else {
                  color = color.v || target.context.fillStyle;
                  target.set_fill_color(color);
                }
              }
              else {
                return target.fillStyle;
              }
            });

            $loc.__str__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(FILL_COLOR)
            })

            $loc.__repr__ = new Sk.builtin.func(function(self, arg) {
              return new Sk.builtin.str(FILL_COLOR)
            })

          }, FILL_COLOR, []));
        }
        case FORWARD: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {

            $loc.__init__ = new Sk.builtin.func(function(self) {
              self.tp$name = FORWARD;
            });

            $loc.__call__ = new Sk.builtin.func(function(self, distance) {
              distance = Sk.builtin.asnum$(distance);
              checkArgs(2, arguments.length, FORWARD);
              target.forward(distance);
            });

            $loc.__str__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(FORWARD)
            })

            $loc.__repr__ = new Sk.builtin.func(function(self, arg) {
              return new Sk.builtin.str(FORWARD)
            })

          }, FORWARD, []));
        }
        case GOTO: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {

            $loc.__init__ = new Sk.builtin.func(function(self) {
              self.tp$name = GOTO;
            });

            $loc.__call__ = new Sk.builtin.func(function(self, nx, ny) {
              nx = Sk.builtin.asnum$(nx);
              ny = Sk.builtin.asnum$(ny);
              checkArgs(3, arguments.length, GOTO);
              target.goto(nx, ny);
            });

            $loc.__str__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(GOTO)
            })

            $loc.__repr__ = new Sk.builtin.func(function(self, arg) {
              return new Sk.builtin.str(GOTO)
            })

          }, GOTO, []));
        }
        case LEFT: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {

            $loc.__init__ = new Sk.builtin.func(function(self) {
              self.tp$name = LEFT;
            });

            $loc.__call__ = new Sk.builtin.func(function(self, angle) {
              angle = Sk.builtin.asnum$(angle);
              checkArgs(2, arguments.length, LEFT);
              target.turn(-angle);
            });

            $loc.__str__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(LEFT)
            })

            $loc.__repr__ = new Sk.builtin.func(function(self, arg) {
              return new Sk.builtin.str(LEFT)
            })

          }, LEFT, []));
        }
        case POSITION: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {

            $loc.__init__ = new Sk.builtin.func(function(self) {
              self.tp$name = POSITION;
              checkArgs(1, arguments.length, POSITION);
            });

            $loc.__getattr__ = new Sk.builtin.func(function(self, key) {
              switch(key) {
                case "x": {
                  var position = target.get_position();
                  return Sk.builtin.assk$(position[0], Sk.builtin.nmber.float$);
                }
                break;
                case "y": {
                  var position = target.get_position();
                  return Sk.builtin.assk$(position[1], Sk.builtin.nmber.float$);
                }
                break;
                default: {
                  // do nothing.
                }
              }
            });

            $loc.__setattr__ = new Sk.builtin.func(function(self, key, value) {
              switch(key) {
                case "x": {
                  var nx = Sk.builtin.asnum$(value);
                  checkArgs(3, arguments.length, key);
                  target.goto(nx, target.gety());
                }
                break;
                case "y": {
                  var ny = Sk.builtin.asnum$(value);
                  checkArgs(3, arguments.length, key);
                  target.goto(target.getx(), ny);
                }
                break;
                default: {
                  // do nothing.
                }
              }
            });

            $loc.__str__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(POSITION)
            })

            $loc.__repr__ = new Sk.builtin.func(function(self, arg) {
              return new Sk.builtin.str(POSITION)
            })

          }, POSITION, []));
        }
        case RIGHT: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {

            $loc.__init__ = new Sk.builtin.func(function(self) {
              self.tp$name = RIGHT;
            });

            $loc.__call__ = new Sk.builtin.func(function(self, angle) {
              angle = Sk.builtin.asnum$(angle);
              checkArgs(2, arguments.length, RIGHT);
              target.turn(angle);
            });

            $loc.__str__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(RIGHT)
            })

            $loc.__repr__ = new Sk.builtin.func(function(self, arg) {
              return new Sk.builtin.str(RIGHT)
            })

          }, RIGHT, []));
        }
        case SHAPE: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {

            $loc.__init__ = new Sk.builtin.func(function(self) {
              self.tp$name = SHAPE;
            });

            $loc.__call__ = new Sk.builtin.func(function(self, shape) {
              checkArgs(2, arguments.length, SHAPE);
              target.shape(shape.v);
            });

            $loc.__str__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(SHAPE)
            })

            $loc.__repr__ = new Sk.builtin.func(function(self, arg) {
              return new Sk.builtin.str(SHAPE)
            })

          }, SHAPE, []));
        }
        case STAMP: {
          return Sk.misceval.callsim(Sk.misceval.buildClass(mod, function($gbl, $loc) {

            $loc.__init__ = new Sk.builtin.func(function(self) {
              self.tp$name = STAMP;
            });

            $loc.__call__ = new Sk.builtin.func(function(self) {
              checkArgs(1, arguments.length, STAMP);
              target.stamp();
            });

            $loc.__str__ = new Sk.builtin.func(function(self) {
              return new Sk.builtin.str(STAMP)
            })

            $loc.__repr__ = new Sk.builtin.func(function(self, arg) {
              return new Sk.builtin.str(STAMP)
            })

          }, STAMP, []));
        }
        case UP: {
          return Sk.ffi.callableToPy(mod, target, UP, function(self) {
            Sk.ffi.checkMethodArgs(UP, arguments, 0, 0);
            target.pen_up();
          });
        }
        default: {
          // Do nothing
        }
      }
    });

    $loc.__setattr__ = new Sk.builtin.func(function(selfPy, name, valuePy) {

      var COLOR = "color";
      var FILL_COLOR = "fillcolor";
      var POSITION = "position";
      var SHAPE = "shape";
      var EUCLIDEAN_2 = "Euclidean2";

      switch(name) {
        case COLOR: {
          if(valuePy) {
            var color = valuePy.v || selfPy.v.context.fillStyle;
            selfPy.v.set_pen_color(color);
            selfPy.v.set_fill_color(color);
          }
        }
        break;
        case FILL_COLOR: {
          if (valuePy) {
            selfPy.v.set_fill_color(valuePy.v || selfPy.v.context.fillStyle);
          }
        }
        break;
        case POSITION: {
          Sk.ffi.checkArgType("value", EUCLIDEAN_2, Sk.ffi.isObjectRef(valuePy) && Sk.ffi.typeName(valuePy) === EUCLIDEAN_2);
          var xPy = Sk.ffi.gattr(valuePy, "x");
          var yPy = Sk.ffi.gattr(valuePy, "y");
          selfPy.v.goto(Sk.ffi.remapToJs(xPy), Sk.ffi.remapToJs(yPy));
        }
        break;
        case SHAPE: {
          if (valuePy) {
            checkArgs(3, arguments.length, SHAPE);
            selfPy.v.shape(valuePy.v);
          }
        }
        break;
        default: {
//          throw new Sk.builtin.AttributeError("'" + SPRITE + "' object has no attribute setter '" + name + "'.");
        }
      }
    });

    $loc.setposition = new Sk.builtin.func(function(self,nx,ny) {
      nx = Sk.builtin.asnum$(nx);
      ny = Sk.builtin.asnum$(ny);
      checkArgs(3,arguments.length,"setposition()");
      self.v.up();
      self.v.goto(nx,ny);
      self.v.down();
    });

    $loc.setpos = $loc.setposition;

    $loc.setheading = new Sk.builtin.func(function(self, newhead) {
      newhead = Sk.builtin.asnum$(newhead);
      checkArgs(2,arguments.length,"setheading()");
      return self.v.set_heading(newhead);
    });

    $loc.seth = $loc.setheading;

    $loc.home = new Sk.builtin.func(function(self) {
      self.v.go_home();
    });

    $loc.dot = new Sk.builtin.func(function(self, /*opt*/ size, color) {
      size = Sk.builtin.asnum$(size);
      size = size || 1;
      if (color) {
        color = color.v || self.v.penStyle;
      }
      self.v.dot(size, color);
    });

    $loc.circle = new Sk.builtin.func(function(self, radius, extent) {
      radius = Sk.builtin.asnum$(radius);
      extent = Sk.builtin.asnum$(extent);
      self.v.circle(radius, extent);
    });

    $loc.delay = new Sk.builtin.func(function(self, d) {
      d = Sk.builtin.asnum$(d);
      return self.v.delay(d);
    });

    $loc.speed = new Sk.builtin.func(function(self, s, t) {
      s = Sk.builtin.asnum$(s);
      t = Sk.builtin.asnum$(t);
      self.v.speed(s,t);
    });

    $loc.tracer = new Sk.builtin.func(function(self, t, d) {
      t = Sk.builtin.asnum$(t);
      d = Sk.builtin.asnum$(d);
      self.v.tracer(t, d);
    });

    $loc.update = new Sk.builtin.func(function(self) {
      //  Dummy function to emulate update... when not animating, we don't save the drawing operations, so this is pointless for us
    });

    $loc.heading = new Sk.builtin.func(function(self) {
      checkArgs(1,arguments.length,"heading()");
      return self.v.get_heading();
    });

    $loc.xcor = new Sk.builtin.func(function(self) {
      checkArgs(1,arguments.length,"xcor()");
      var res = self.v.getx();
      return res;
    });

    $loc.ycor = new Sk.builtin.func(function(self) {
      checkArgs(1,arguments.length,"ycor()");
      var res = self.v.gety();
      return res;
    });

    $loc.towards = new Sk.builtin.func(function(self, tx, ty) {
      tx = Sk.builtin.asnum$(tx);
      ty = Sk.builtin.asnum$(ty);
      if ((typeof(tx)).toLowerCase() === 'number')
        tx = [tx, ty, 0];
      return self.v.towards(tx);
    });

    // tx can be either a number or a vector position.
    // tx can not be a sprite at this time as multiple sprites have not been implemented yet.
    $loc.distance = new Sk.builtin.func(function(self, tx, ty) {
      tx = Sk.builtin.asnum$(tx);
      ty = Sk.builtin.asnum$(ty);
      if ((typeof(tx)).toLowerCase() === 'number') {
        tx = [tx, ty, 0];
      }
      else {
        tx = [tx.v.getx(), tx.v.gety(), 0];
      }
      return self.v.distance(tx);
    });

    //
    // Setting and Measurement
    //

    $loc.width = new Sk.builtin.func(function(self, w) {
     w = Sk.builtin.asnum$(w);
     checkArgs(2,arguments.length,"width()");
     self.v.set_pen_width(w);
   });

    $loc.pensize = $loc.width;

    $loc.isdown = new Sk.builtin.func(function(self) {
      checkArgs(1,arguments.length,"isdown()");
      return self.v.get_pen();
    });

    $loc.pencolor = new Sk.builtin.func(function(self, color, green, blue) {
      if (color) {
        if (blue) {
          color = Sk.builtin.asnum$(color);
          green = Sk.builtin.asnum$(green);
          blue = Sk.builtin.asnum$(blue);
          self.v.set_pen_color(color, green, blue);
        }
        else {
          color = color.v || self.v.context.fillStyle;
          self.v.set_pen_color(color);
        }
      }
      else {
        return self.v.penStyle;
      }
    });

    $loc.color = new Sk.builtin.func(function(self, color, green, blue) {
      if(color) {
        if (blue) {
          self.v.set_pen_color(color, green, blue);
          self.v.set_fill_color(color, green, blue);
        }
        else {
          color = color.v || self.v.context.fillStyle;
          self.v.set_pen_color(color);
          self.v.set_fill_color(color);
        }
      }
      else {
        return [self.v.penStyle, self.v.fillStyle];
      }
    });

    $loc.fill = new Sk.builtin.func(function(self, fillt) {
      if (fillt === undefined)
        return self.v.filling;
      if (fillt)
        self.v.begin_fill();
      else
        self.v.end_fill();
    });

    //
    // More drawing control
    //

    $loc.reset = new Sk.builtin.func(function(self) {
      self.v.clean();
    });

    $loc.showturtle = new Sk.builtin.func(function(self) {
      checkArgs(1,arguments.length,"showturtle()");
      self.v.showturtle();
    });

    $loc.st = $loc.showturtle;

    $loc.hideturtle = new Sk.builtin.func(function(self) {
      checkArgs(1,arguments.length,"hideturtle()");
      self.v.hideturtle();
    });

    $loc.ht = $loc.hideturtle;

    $loc.isvisible = new Sk.builtin.func(function(self) {
      checkArgs(1,arguments.length,"isvisible()");
      self.v.isvisible()
    });

    // todo the move, align, and font parameters should be kwargs...
    $loc.write = new Sk.builtin.func(function(self, mystr, move, align, font) {
      self.v.write(mystr.v, move, align, font);
    });

    // todo clean  -- again multiple sprites

    $loc.setworldcoordinates = new Sk.builtin.func(function(self, llx, lly, urx, ury) {
      llx = Sk.builtin.asnum$(llx);
      lly = Sk.builtin.asnum$(lly);
      urx = Sk.builtin.asnum$(urx);
      ury = Sk.builtin.asnum$(ury);
      self.v.setworldcoordinates(llx, lly, urx, ury);
    });

    $loc.clear = new Sk.builtin.func(function(self) {
      self.v.clear()
    });
  }

  mod[SPRITE] = Sk.misceval.buildClass(mod, sprite, SPRITE, []);

  var screen = function($gbl, $loc) {
    $loc.__init__ = new Sk.builtin.func(function(self) {
      SpriteGraphics.defaults = {canvasID: Sk.canvas, animate: true, degrees: true};
      var currentCanvas = SpriteGraphics.canvasLib[SpriteGraphics.defaults.canvasID];
      if (currentCanvas === undefined) {
        self.theScreen = new SpriteGraphics.SpriteCanvas(SpriteGraphics.defaults);
      } else {
        self.theScreen = currentCanvas;
      }
    });

    $loc.bgcolor = new Sk.builtin.func(function(self, c) {
      self.theScreen.bgcolor(c);
    });

    $loc.setworldcoordinates = new Sk.builtin.func(function(self, llx,lly,urx,ury) {
     llx = Sk.builtin.asnum$(llx);
     lly = Sk.builtin.asnum$(lly);
     urx = Sk.builtin.asnum$(urx);
     ury = Sk.builtin.asnum$(ury);
     self.theScreen.setworldcoordinates(llx,lly,urx,ury);
   });

    $loc.exitonclick = new Sk.builtin.func(function(self) {
      self.theScreen.exitonclick();
    });

    $loc.title = new Sk.builtin.func(function(self,titlestring) {
      // no op....
    });

    $loc.window_width = new Sk.builtin.func(function(self) {
      return self.theScreen.window_width();
    });

    $loc.window_height = new Sk.builtin.func(function(self) {
      return self.theScreen.window_height();
    });

    $loc.sprites = new Sk.builtin.func(function(self) {
      return self.theScreen.sprites();
    });

    $loc.colormode = new Sk.builtin.func(function(self) {
      //  Empty function to emulate compatibility
    });

    var myfunc = function(self, width, height, startx, starty) {
      width = Sk.builtin.asnum$(width);
      height = Sk.builtin.asnum$(height);
      self.theScreen.setup(width,height);
    }
    // this should allow for named parameters
    myfunc.co_varnames = ['self','width','height','startx','starty'];
    myfunc.$defaults = [null,500,500,0,0];
    $loc.setup = new Sk.builtin.func(myfunc);
  }

  mod.Screen = Sk.misceval.buildClass(mod, screen, 'Screen', []);

  mod.tracer = new Sk.builtin.func(function(t, d) {
    t = Sk.builtin.asnum$(t);
    d = Sk.builtin.asnum$(d);
    for (var i in Sk.tg.canvasLib) {
      Sk.tg.canvasLib[i].tracer(t, d);
    }
  });

  mod.update = new Sk.builtin.func(function(self) {
    //  Dummy function to emulate update... when not animating, we don't save the drawing operations, so this is pointless for us
  });

  return mod
}
