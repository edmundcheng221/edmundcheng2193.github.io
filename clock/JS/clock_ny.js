(function( $ ) { //begin jquery

    $.fn.clock = function(options) { // start clock function, options object
        
        this.each(function() {  //this refers to instance of a class (similar to self in python)
            // each iterates
        var cnv, // canvas
            ctx, // context
            el, // element loaded with all settings parameters
            defaults, // default attributes
            settings, // defaults + options
            radius,
            x, // parameter for startClock function


       defaults = { // set default features/appearance of the clock
                size: 100,  // initial size of dial
                dialColor: 'white', // color of dial
                secondHandColor: 'red', // color of the second hand
                minuteHandColor: '#222222', // color of the minute hand
                hourHandColor: '#222222', // color of the hour hand
                showNumerals: true, // show the numbers next to dial
                numerals: [ // shows hours 1-12
                    {1:1},
                    {2:2},
                    {3:3},
                    {4:4},
                    {5:5}, //mapping for the time
                    {6:6},
                    {7:7},
                    {8:8},
                    {9:9},
                    {10:10},
                    {11:11},
                    {12:12}
                ],
                sweepingMinutes: true, // want the minutes to sweep (continuous)
                sweepingSeconds: false, // want seconds to not be continuous, update every second
                numeralFont: 'arial', // number font
                brandFont: 'arial' // timezone + location font
            };

            settings = $.extend({}, defaults, options); //extend merges the properties

            el = this; // like "self" from python
            // defines the parameters of el
            el.size = settings.size; // controls size
            el.dialColor = settings.dialColor; // controls dial color
            el.secondHandColor = settings.secondHandColor; // color of second hand
            el.minuteHandColor = settings.minuteHandColor; // color of minute hand
            el.hourHandColor = settings.hourHandColor; // color of hour hand
            el.showNumerals = settings.showNumerals; // show the numbers
            el.numerals = settings.numerals; // the numbers shown
            el.numeralFont = settings.numeralFont; // font of the numbers
            el.brandText = settings.brandText; // text 1 with the time zone
            el.brandText2 = settings.brandText2; // text 2 with the location
            el.brandFont = settings.brandFont; // font of the text
            el.sweepingMinutes = settings.sweepingMinutes; // minutes sweeps
            el.sweepingSeconds = settings.sweepingSeconds; // seconds sweeps

            cnv = document.createElement('canvas'); // creates canvas for the clock
            ctx = cnv.getContext('2d'); //2d rendering of clock

            cnv.width = this.size; // adjust width of canvas
            cnv.height = this.size; // adjust height of canvas
            //append canvas to element
            $(cnv).appendTo(el); // appends el to the canvas
            // defines clock radius
            radius = parseInt(el.size/2, 10); // parseInt parses a string and returns and int
            //translate 0,0 to center of circle:
            ctx.translate(radius, radius); // translates where the clock is
   

            function toRadians(deg){ // convert degrees to radians
                return ( Math.PI / 180 ) * deg; 
            }     
            

            // driaws the dial for the clock
            function drawDial(color){
                var dialRadius, // radius of the dial, controls size of dial
                    i, // iterator
                    ang, // angle
                    sang, // sine of angle
                    cang, // cosine of angle
                    sx, // arc x (dial radius - dial radius/20)
                    sy, // arc y (dial radius - dial radius/20)
                    ex, // arc x (dial radius)
                    ey, // arc y( dial radius)
                    nx, // The x coordinate where to start painting the text for fillText method later
                    ny, // The y coordinate where to start painting the text for fillText method later
                    textSize, // size of text
                    textWidth, // width of text for numeral
                    textWidth2, // width of text for time zone
                    textWidth3; // width of text for location

                dialRadius = parseInt(radius-(el.size/50), 10); // radius of dial

                for (i=1; i<=60; i++) { // from 1 min to 60 min
                    ang=Math.PI/30*i; // angle conversion
                    sang=Math.sin(ang);  // sin of angle
                    cang=Math.cos(ang); // cosine of angle
                    //hour marker/numeral
                    if (i % 5 === 0) { // checks is a multiple of 5 minutes
                  
                        ctx.lineWidth = parseInt(el.size/50,10); // width of the lines at each hour number (1 to 12)
                        sx = sang * (dialRadius - dialRadius/9); // angle of each line w/ respect to x
                        sy = cang * -(dialRadius - dialRadius/9); // angle of each line w/ respect to y
                        ex = sang * dialRadius; //arc x
                        ey = cang * - dialRadius; //arc y
                        nx = sang * (dialRadius - dialRadius/4.2); // how close numbers are to the lines w.r.t x
                        ny = cang * -(dialRadius - dialRadius/4.2); // how close numbers are to the lines w.r.t y
                        marker = i/5; // 60/5 = 12 differnt labels

                        textSize = parseInt(el.size/13,10); // sets size of hour label nums
                        ctx.font = '100 ' + textSize + 'px ' + el.numeralFont; // font size
                        ctx.fillStyle = color;  // font color

                        if(el.showNumerals && el.numerals.length > 0){
                            el.numerals.map(function(numeral){  // creates the numbers in clock
                                if(marker == Object.keys(numeral)){ // map the keys in dictionary
                                    textWidth = ctx.measureText (numeral[marker]).width; 
                                    // adjusts positioning of text
                                    ctx.fillText(numeral[marker],nx-(textWidth/2),ny);  // draws the filltext on the canvas
                                // parameters - text, x coordinate where to fill text, y coordinate where to fill text
                                }

                            });
                        }
                    //minute marker
                    } else { // adjust the formatting of the minute lines in the dial
                        ctx.lineWidth = parseInt(el.size/100,10); // line width for minute labels
                        sx = sang * (dialRadius - dialRadius/20); // arc x for minute angle 
                        sy = cang * -(dialRadius - dialRadius/20); // arc y for minute angle
                        ex = sang * dialRadius; // arc x
                        ey = cang * - dialRadius; // arc y
                    }

                    ctx.beginPath(); // clears prior path operations such as arc
                    ctx.strokeStyle = color; // adjust color
                    ctx.lineCap = "round"; // makes the lines round
                    ctx.moveTo(sx,sy); // move to coordinate specified
                    ctx.lineTo(ex,ey); // draws line to coordinates specified
                    ctx.stroke(); // draws the path
                } 

                if(el.brandText !== undefined){ // font and formatting of the timezone text
                    ctx.font = '100 ' + parseInt(el.size/28,10) + 'px ' + el.brandFont;
                    textWidth2 = ctx.measureText(el.brandText).width;
                    ctx.fillText(el.brandText,-(textWidth2/2),(el.size/6)); 
                }

                if(el.brandText2 !== undefined){ // font and formatting of the location text
                    ctx.textBaseline = 'middle'; // moves text to middle
                    ctx.font = '100 ' + parseInt(el.size/44,10) + 'px ' + el.brandFont;
                    textWidth3 = ctx.measureText (el.brandText2).width;
                    ctx.fillText(el.brandText2,-(textWidth3/2),(el.size/5)); 
                }

            }

            function twelvebased(hour){ //restart hand after reaching 12
                if(hour >= 12){
                    hour = hour - 12;
                }
                return hour;
            }

            function drawHand(length){ // draw the hands
               ctx.beginPath();
               ctx.moveTo(0,0);
               ctx.lineTo(0, -length);
               ctx.stroke();
            }
            
            function drawSecondHand(milliseconds, seconds, color){ // function to draw the seconds hand
                var shlength = (radius)-(el.size/40);
                
                ctx.save();
                ctx.lineWidth = parseInt(el.size/150,10);
                ctx.lineCap = "round";
                ctx.strokeStyle = color;

                ctx.rotate( toRadians((milliseconds * 0.006) + (seconds * 6))); // rotate the hand

                drawHand(shlength);

                //tail of secondhand
                ctx.beginPath();
                ctx.moveTo(0,0);
                ctx.lineTo(0, shlength/15);
                ctx.lineWidth = parseInt(el.size/30,10);
                ctx.stroke();

                //round center
                ctx.beginPath();
                ctx.arc(0, 0, parseInt(el.size/30,10), 0, 360, false);
                ctx.fillStyle = color;

                ctx.fill();
                ctx.restore();
            }

            function drawMinuteHand(minutes, color){ //function to draw the minute hand
                var mhlength = el.size/2.2;
                ctx.save();
                ctx.lineWidth = parseInt(el.size/50,10);
                ctx.lineCap = "round";
                ctx.strokeStyle = color;
               
         
                ctx.rotate( toRadians(minutes * 6));

                drawHand(mhlength);
                ctx.restore();
            }

            function drawHourHand(hours, color){ // function to graw the hour hand
                var hhlength = el.size/3;
                ctx.save();
                ctx.lineWidth = parseInt(el.size/25, 10);
                ctx.lineCap = "round";
                ctx.strokeStyle = color;
                ctx.rotate( toRadians(hours * 30));


                drawHand(hhlength); 
                ctx.restore(); // need to skeep the dial from spinning
            }

    
            function startClock(x){
                var theDate,  // declare relevant variables
                    ms, //millisecond
                    s,  //second
                    m,  //min in float
                    hours,  // hour
                    mins, //min integer
                    h; // hour float

                theDate = new Date(); // get date


// change the time
    
                s = theDate.getSeconds(); // get the current number of seconds elapsed
                el.sweepingSeconds ? ms = theDate.getMilliseconds() : ms = 0; // get millisonds elapsed
                mins = theDate.getMinutes();  // get number of minutes elapsed
                m = (mins  + (s/60));  // minute hand = num minutes
                hours = theDate.getHours(); // get number of hours elapsed
                h = twelvebased(hours + (m/60));  // hour hand based on number of hours and number 
                //and number of minutes elapsed

                // modifies the size of hands 
                ctx.clearRect(-radius,-radius,el.size,el.size);

                // draws the outter dial
                drawDial(el.dialColor);


                drawHourHand(h, el.hourHandColor); //trigger drawHourHand function
                drawMinuteHand(m, el.minuteHandColor); //trigger drawMinuteHand function
                drawSecondHand(ms, s, el.secondHandColor); //trigger drawSecondHand function

                // triggers hand to move every second
                window.requestAnimationFrame(function(){startClock(x)});

            }

            startClock(x); // calls the startClock function

   });//return each
  };     

}(jQuery)); // end jquery