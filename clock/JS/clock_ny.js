(function( $ ) { //begin jquery

    $.fn.clock = function(options) {
        
        this.each(function() {  //this refers to instance of a class (similar to self in python)

        var cnv,
            ctx,
            el,
            defaults,
            settings,
            radius,
            x,


       defaults = { // set default features/appearance of the clock
                size: 100, 
                dialColor: 'white',
                dialBackgroundColor:'transparent',
                secondHandColor: 'red',
                minuteHandColor: '#222222',
                hourHandColor: '#222222',
                alarmHandColor: '#FFFFFF',
                alarmHandTipColor: '#026729',
                showNumerals: true,
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
                sweepingMinutes: true,
                sweepingSeconds: false,
                numeralFont: 'arial',
                brandFont: 'arial'
            };

            settings = $.extend({}, defaults, options); //extend merges the properties

            el = this; // like "self" from python
            // defines the parameters of el
            el.size = settings.size;
            el.dialColor = settings.dialColor;
            el.dialBackgroundColor = settings.dialBackgroundColor;
            el.secondHandColor = settings.secondHandColor;
            el.minuteHandColor = settings.minuteHandColor;
            el.hourHandColor = settings.hourHandColor;
            el.alarmHandColor = settings.alarmHandColor;
            el.alarmHandTipColor = settings.alarmHandTipColor;
            el.timeCorrection = settings.timeCorrection;
            el.showNumerals = settings.showNumerals;
            el.numerals = settings.numerals;
            el.numeralFont = settings.numeralFont;
            el.brandText = settings.brandText;
            el.brandText2 = settings.brandText2;
            el.brandFont = settings.brandFont;
            el.onEverySecond = settings.onEverySecond;
            el.sweepingMinutes = settings.sweepingMinutes;
            el.sweepingSeconds = settings.sweepingSeconds;

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
                var dialRadius,
                    i,
                    ang, // angle
                    sang, // sine of angle
                    cang, // cosine of angle
                    sx, // sin x
                    sy, // sin y
                    ex, // arc x
                    ey, // arc y
                    nx, //
                    ny,
                    textSize,
                    textWidth,
                    textWidth2,
                    textWidth3;

                dialRadius = parseInt(radius-(el.size/50), 10); // radius of dial

                for (i=1; i<=60; i++) {
                    ang=Math.PI/30*i;
                    sang=Math.sin(ang); 
                    cang=Math.cos(ang);
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
                        ctx.fillStyle = color; 

                        if(el.showNumerals && el.numerals.length > 0){
                            el.numerals.map(function(numeral){  // creates the numbers in clock
                                if(marker == Object.keys(numeral)){ // map the keys in dictionary
                                    textWidth = ctx.measureText (numeral[marker]).width; 
                                    // adjusts positioning of text
                                    ctx.fillText(numeral[marker],nx-(textWidth/2),ny); 
                                }
                            });
                        }
                    //minute marker
                    } else { // adjust the formatting of the minute lines in the dial
                        ctx.lineWidth = parseInt(el.size/100,10);
                        sx = sang * (dialRadius - dialRadius/20);
                        sy = cang * -(dialRadius - dialRadius/20);
                        ex = sang * dialRadius;
                        ey = cang * - dialRadius;
                    }

                    ctx.beginPath(); // clears prior path operations such as arc
                    ctx.strokeStyle = color;
                    ctx.lineCap = "round"; // makes the lines round
                    ctx.moveTo(sx,sy); 
                    ctx.lineTo(ex,ey);
                    ctx.stroke(); // draws the path
                } 

                if(el.brandText !== undefined){ // font and formatting of the timezone text
                    ctx.font = '100 ' + parseInt(el.size/28,10) + 'px ' + el.brandFont;
                    textWidth2 = ctx.measureText (el.brandText).width;
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
                    ms, 
                    s, 
                    m, 
                    hours, 
                    mins, 
                    h;

                theDate = new Date();


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
                drawDial(el.dialColor, el.dialBackgroundColor);


                drawHourHand(h, el.hourHandColor); //trigger drawHourHand function
                drawMinuteHand(m, el.minuteHandColor); //trigger drawMinuteHand function
                drawSecondHand(ms, s, el.secondHandColor); //trigger drawSecondHand function

                // triggers hand to move every second
                window.requestAnimationFrame(function(){startClock(x)});

            }

            startClock(x);

   });//return each
  };     

}(jQuery)); // end jquery