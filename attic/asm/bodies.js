// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
 
// requestAnimationFrame polyfill by Erik Moller
// fixes from Paul Irish and Tino Zijdel
 
(function(window) {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame){
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }
 
    if (!window.cancelAnimationFrame){
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    }
}(this));

!function(){

    var bodies = new ASMHelpers.Collection({
        'x'    : 'double',
        'y'    : 'double',
        // previous position values encode velocity for verlet integration
        'px'    : 'double', // previous x
        'py'    : 'double', // previous y
        'ax'   : 'double',
        'ay'   : 'double'
    });

    // bulk of the physics engine
    bodies.include(function(stdlib, coln, heap){
        "useHIDEMEFROMSEARCHasm";

        var sqrt = stdlib.Math.sqrt;
        // set up our view to look into the heap
        var float64 = new stdlib.Float64Array( heap );

        // x parameters
        var $x = coln.$x|0;
        var $px = coln.$px|0;
        var $ax = coln.$ax|0;

        // y parameters
        var $y = coln.$y|0;
        var $py = coln.$py|0;
        var $ay = coln.$ay|0;

        // will get the number of objects in the collection
        var getLen = coln.getLen;
        // the size of each object in bytes
        var size = coln.objSize|0;
        // starting point for iteration
        var iterator = coln.ptr|0;

        // static properties for newtonian gravity
        var newton_stren = 0.1;
        var newton_tol = 50.0;

        // math helpers

        function max( p, q ){
            p = +p;
            q = +q;

            return +((p > q) ? p : q);
        }

        function min( p, q ){
            p = +p;
            q = +q;

            return +((p < q) ? p : q);
        }

        // integrate by one timestep
        function integrate( dt ){
            dt = dt|0;

            var i = 0, l = 0, ptr = 0;
            ptr = iterator|0;
            l = getLen()|0;

            // loop through objects and execute integrateOne on them
            while ((i|0) < (l|0)){
                integrateOne( ptr, dt );
                i = ((i|0) + 1)|0;
                ptr = ((ptr|0) + (size|0))|0;
            }
        }

        // integrate one object ($obj pointer) by timestep dt
        function integrateOne( $obj, dt ){
            $obj = $obj|0;
            dt = dt|0;

            var x = 0.0,
                y = 0.0,
                px = 0.0,
                py = 0.0,
                vx = 0.0,
                vy = 0.0,
                ax = 0.0,
                ay = 0.0,
                dtSq = 0.0;

            // dt * dt
            dtSq = +(+(dt|0) * +(dt|0));

            // get the values for the object from memory
            // 3 is because we're dealing with float64
            // (# bytes) >> 3 --> 64 bit array index
            x = +float64[($obj + $x) >> 3];
            px = +float64[($obj + $px) >> 3];
            ax = +float64[($obj + $ax) >> 3];

            y = +float64[($obj + $y) >> 3];
            py = +float64[($obj + $py) >> 3];
            ay = +float64[($obj + $ay) >> 3];

            // (velocity) = (position) - (previous position)
            vx = +x - +px;
            vy = +y - +py;

            // store old positions
            float64[($obj + $px) >> 3] = +x;
            float64[($obj + $py) >> 3] = +y;

            // apply acceleration and inertia
            // x = x + (v) + (a * dt * dt)

            x = +(+x + +vx);
            y = +(+y + +vy);

            x = +(+x + +ax * +dtSq);
            y = +(+y + +ay * +dtSq);

            float64[($obj + $x) >> 3] = +x;
            float64[($obj + $y) >> 3] = +y;

            // set accelerations to zero
            float64[($obj + $ax) >> 3] = 0.0;
            float64[($obj + $ay) >> 3] = 0.0;
        }

        function newtonianBetween( $obj1, $obj2 ){

            $obj1 = $obj1|0;
            $obj2 = $obj2|0;

            var dx = 0.0, dy = 0.0, n = 0.0;

            // difference between positions
            dx = +float64[($obj1 + $x) >> 3] - +float64[($obj2 + $x) >> 3];
            dy = +float64[($obj1 + $y) >> 3] - +float64[($obj2 + $y) >> 3];

            // norm squared
            n = (+dx) * (+dx) + (+dy) * (+dy);

            if ( n > newton_tol ){

                n = (+newton_stren) / (+n) / +sqrt(n);

                // multiply by strength of gravity
                dx = (+dx) * (+n);
                dy = (+dy) * (+n);

                applyAccelerationObj( $obj2, dx, dy );

                // reverse
                dx = -(+dx);
                dy = -(+dy);
                applyAccelerationObj( $obj1, dx, dy );
            }
        }

        // double iteration and apply newtonian gravity between all objects
        function newtonianGravity(){

            var i = 0, l = 0, ptr = 0;
            var ii = 0, ptrptr = 0;
            ptr = iterator|0;
            l = getLen()|0;

            while ((i|0) < (l|0)){

                ii = ((i|0) + 1)|0;
                ptrptr = ((ptr|0) + (size|0))|0;

                while ((ii|0) < (l|0)){

                    newtonianBetween( ptr, ptrptr );

                    ii = ((ii|0) + 1)|0;
                    ptrptr = ((ptrptr|0) + (size|0))|0;
                }

                i = ((i|0) + 1)|0;
                ptr = ((ptr|0) + (size|0))|0;
            }
        }

        function applyAccelerationObj( $obj, ax, ay ){

            $obj = $obj|0;
            ax = +ax;
            ay = +ay;

            float64[($obj + $ax) >> 3] = +float64[($obj + $ax) >> 3] + +ax;
            float64[($obj + $ay) >> 3] = +float64[($obj + $ay) >> 3] + +ay;
        }

        function applyAcceleration( ax, ay ){
            ax = +ax;
            ay = +ay;

            var i = 0, l = 0, ptr = 0;
            ptr = iterator|0;
            l = getLen()|0;

            // loop through objects
            while ((i|0) < (l|0)){
                
                // add acceleration to every body
                applyAccelerationObj( ptr, ax, ay );

                i = ((i|0) + 1)|0;
                ptr = ((ptr|0) + (size|0))|0;
            }
        }

        // we'll constrain the particles to a 600x600 box
        function applyConstraints(){

            var i = 0, l = 0, ptr = 0;
            ptr = iterator|0;
            l = getLen()|0;

            // loop through objects
            while ((i|0) < (l|0)){

                float64[(ptr + $x) >> 3] = +max(0.0, +float64[(ptr + $x) >> 3]);
                float64[(ptr + $y) >> 3] = +max(0.0, +float64[(ptr + $y) >> 3]);

                float64[(ptr + $x) >> 3] = +min(600.0, +float64[(ptr + $x) >> 3]);
                float64[(ptr + $y) >> 3] = +min(600.0, +float64[(ptr + $y) >> 3]);

                i = ((i|0) + 1)|0;
                ptr = ((ptr|0) + (size|0))|0;
            }
        }

        return {
            integrate: integrate,
            newtonianGravity: newtonianGravity,
            applyAcceleration: applyAcceleration,
            applyConstraints: applyConstraints
        };
    });

    // for getting prefixed style attribute names
    var thePrefix = {}
        ,tmpdiv = document.createElement("div")
        ,toTitleCase = function toTitleCase(str) {
            return str.replace(/(?:^|\s)\w/g, function(match) {
                return match.toUpperCase();
            });
        }
        ,pfx = function pfx(prop) {

            if (thePrefix[prop]){
                return thePrefix[prop];
            }

            var arrayOfPrefixes = ['Webkit', 'Moz', 'Ms', 'O']
                ,name
                ;

            for (var i = 0, l = arrayOfPrefixes.length; i < l; ++i) {

                name = arrayOfPrefixes[i] + toTitleCase(prop);

                if (name in tmpdiv.style){
                    return thePrefix[prop] = name;
                }
            }

            if (name in tmpdiv.style){
                return thePrefix[prop] = prop;
            }

            return false;
        }
        ;

    var time = 0
        ,viewport = document.getElementById('viewport')
        ,ctx = viewport.getContext('2d')
        ,cssTransform = pfx('transform')
        ,Pi2 = Math.PI * 2
        ,running = false
        ,objselect = document.getElementById('objcount')
        ;

    objselect.onchange = function(){

        var count = objselect.value|0;

        if ( count > bodies.count() ){
        
            bodies.clear();
            init( count );

        } else {

            bodies.remove(count, bodies.count() - count);
        }
    };

    function init( count ){
    
        var x, y;

        for ( var i = 0, l = count; i < l; ++i ){
            
            x = Math.random() * 600;
            y = Math.random() * 600;

            bodies.add({
                x: x,
                y: y,
                px: x - (y - 300)/1000,
                py: y + (x - 300)/1000
            });
        }

        if (!running){
            running = true;
            step();
        }
    }

    function renderBody( body ){

        ctx.beginPath();
        ctx.arc(body.x, body.y, 2, 0, Pi2, false);
        ctx.closePath();
        ctx.strokeStyle = "#cc5";
        ctx.stroke();
        ctx.fillStyle = "#cc5";
        ctx.fill();
    }

    function step(){

        window.requestAnimationFrame(step);

        var now = (new Date()).getTime()
            ,diff = now - time
            ,dt = 1000.0 / 640
            ,maxJump = dt * 16
            ;

        if ( !diff ) return this;
        
        // limit number of substeps in each step
        if ( diff > maxJump ){

            time = now - maxJump;
        }

        // break every rendering step into substeps for integration
        while ( time < now ){
            time += dt;
            bodies.newtonianGravity();
            bodies.integrate( dt );
            bodies.applyConstraints();
        }
        
        // render all the bodies
        viewport.width = viewport.width;
        bodies.each(renderBody);
    }

    // RUN IT!
    init( objselect.value|0 );
}();