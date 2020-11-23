(function( $ ) {

    $.fn.clock = function(options) {
        
        this.each(function() {

        var cnv,
                ctx,
                el,
                defaults,
                settings,
                radius,
                x,


       defaults = {
                size: 100,
                dialColor: 'blue',
                secondHandColor: 'red',
                minuteHandColor: '#222222',
                hourHandColor: '#222222',
                showNumerals: true,
                numerals: [
                    {1:1},
                    {2:2},
                    {3:3},
                    {4:4},
                    {5:5},
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

            settings = $.extend({}, defaults, options);

            el = this;

            el.size = settings.size;
            el.dialColor = settings.dialColor;
            el.secondHandColor = settings.secondHandColor;
            el.minuteHandColor = settings.minuteHandColor;
            el.hourHandColor = settings.hourHandColor;
            el.showNumerals = settings.showNumerals;
            el.numerals = settings.numerals;
            el.numeralFont = settings.numeralFont;
            el.brandText = settings.brandText;
            el.brandText2 = settings.brandText2;
            el.brandFont = settings.brandFont;
            el.sweepingMinutes = settings.sweepingMinutes;
            el.sweepingSeconds = settings.sweepingSeconds;

            
            cnv = document.createElement('canvas');
            ctx = cnv.getContext('2d');

            cnv.width = this.size;
            cnv.height = this.size;
            //append canvas to element
            $(cnv).appendTo(el);

            radius = parseInt(el.size/2, 10);
            //translate 0,0 to center of circle:
            ctx.translate(radius, radius); 
        

            function toRadians(deg){
                return ( Math.PI / 180 ) * deg;
            }     

            function drawDial(color){
                var dialRadius,
                    i,
                    ang,
                    sang,
                    cang,
                    sx,
                    sy,
                    ex,
                    ey,
                    nx,
                    ny,
                    textSize,
                    textWidth,
                    brandtextWidth,
                    brandtextWidth2;

                dialRadius = parseInt(radius-(el.size/50), 10);

                 
                for (i=1; i<=60; i++) {
                    ang=Math.PI/30*i;
                    sang=Math.sin(ang);
                    cang=Math.cos(ang);
                    //hour marker/numeral
                    if (i % 5 === 0) {
                        ctx.lineWidth = parseInt(el.size/50,10);
                        sx = sang * (dialRadius - dialRadius/9);
                        sy = cang * -(dialRadius - dialRadius/9);
                        ex = sang * dialRadius;
                        ey = cang * - dialRadius;
                        nx = sang * (dialRadius - dialRadius/4.2);
                        ny = cang * -(dialRadius - dialRadius/4.2);
                        marker = i/5;

                        ctx.textBaseline = 'middle';
                        textSize = parseInt(el.size/13,10);
                        ctx.font = '100 ' + textSize + 'px ' + el.numeralFont;
                        ctx.beginPath();
                        ctx.fillStyle = color;

                        if(el.showNumerals && el.numerals.length > 0){
                            el.numerals.map(function(numeral){
                                if(marker == Object.keys(numeral)){
                                    textWidth = ctx.measureText (numeral[marker]).width;
                                    ctx.fillText(numeral[marker],nx-(textWidth/2),ny);
                                }
                            });
                        }
                    //minute marker
                    } else {
                       ctx.lineWidth = parseInt(el.size/100,10);
                        sx = sang * (dialRadius - dialRadius/20);
                        sy = cang * -(dialRadius - dialRadius/20);
                        ex = sang * dialRadius;
                        ey = cang * - dialRadius;
                    }

                    ctx.beginPath();
                    ctx.strokeStyle = color;
                    ctx.lineCap = "round";
                    ctx.moveTo(sx,sy);
                    ctx.lineTo(ex,ey);
                    ctx.stroke();
                } 

                if(el.brandText !== undefined){
                    ctx.font = '100 ' + parseInt(el.size/28,10) + 'px ' + el.brandFont;
                    brandtextWidth = ctx.measureText (el.brandText).width;
                    ctx.fillText(el.brandText,-(brandtextWidth/2),(el.size/6)); 
                }

                if(el.brandText2 !== undefined){
                    ctx.textBaseline = 'middle';
                    ctx.font = '100 ' + parseInt(el.size/44,10) + 'px ' + el.brandFont;
                    brandtextWidth2 = ctx.measureText (el.brandText2).width;
                    ctx.fillText(el.brandText2,-(brandtextWidth2/2),(el.size/5)); 
                }

            }

            function twelvebased(hour){
                if(hour >= 12){
                    hour = hour - 12;
                }
                return hour;
            }

            function drawHand(length){
               ctx.beginPath();
               ctx.moveTo(0,0);
               ctx.lineTo(0, length * -1);
               ctx.stroke();
            }
            
            function drawSecondHand(milliseconds, seconds, color){
                var shlength = (radius)-(el.size/40);
                
                ctx.save();
                ctx.lineWidth = parseInt(el.size/150,10);
                ctx.lineCap = "round";
                ctx.strokeStyle = color;

                ctx.rotate( toRadians((milliseconds * 0.006) + (seconds * 6)));

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

            function drawMinuteHand(minutes, color){
                var mhlength = el.size/2.2;
                ctx.save();
                ctx.lineWidth = parseInt(el.size/50,10);
                ctx.lineCap = "round";
                ctx.strokeStyle = color;
               

                ctx.rotate( toRadians(minutes * 6));


                drawHand(mhlength);
                ctx.restore();
            }

            function drawHourHand(hours, color){
                var hhlength = el.size/3;
                ctx.save();
                ctx.lineWidth = parseInt(el.size/25, 10);
                ctx.lineCap = "round";
                ctx.strokeStyle = color;
                ctx.rotate( toRadians(hours * 30));

                drawHand(hhlength);
                ctx.restore();
            }



            function startClock(x){
                var theDate, 
                    ms,
                    s,
                    m,
                    hours,
                    mins,
                    h;

                theDate = new Date();

                if(el.timeCorrection){
                    if(el.timeCorrection.operator === '+'){
                        theDate.setHours(theDate.getHours() + el.timeCorrection.hours);
                        theDate.setMinutes(theDate.getMinutes() + el.timeCorrection.minutes);
                    }
                    if(el.timeCorrection.operator === '-'){
                        theDate.setHours(theDate.getHours() - el.timeCorrection.hours);
                        theDate.setMinutes(theDate.getMinutes() - el.timeCorrection.minutes);
                    }
                }
// change the time
    
                s = theDate.getSeconds(); 
                el.sweepingSeconds ? ms = theDate.getMilliseconds() : ms = 0;
                mins = theDate.getMinutes();
                m = (mins  + (s/60));
                hours = theDate.getHours();
                h = twelvebased(hours + (m/60))+6;

                ctx.clearRect(-radius,-radius,el.size,el.size);

                drawDial(el.dialColor);


                drawHourHand(h, el.hourHandColor);
                drawMinuteHand(m, el.minuteHandColor);
                drawSecondHand(ms, s, el.secondHandColor);

                
                window.requestAnimationFrame(function(){startClock(x)});

            }

            startClock(x);

   });//return each this;
  };     

}(jQuery));