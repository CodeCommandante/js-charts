    /**
     * @@par Description:
     * Renders a horizontal-orientation bar chart.
     * */
    function drawHorizontalBarChart() {
        /** The primary canvas with the bars, axes, and tick-marks. */
        let canvas = document.getElementById('myCanvas');

        /** The secondary canvas which renders data at the mouse cursor. */
        let hcanvas = document.getElementById('myCanvas-hidden');

        /** The primary canvas' context. */
        let ctx = canvas.getContext('2d');

        /** The device pixel ratio (used to fix the sharpness of the image). */
        let dpi = window.devicePixelRatio;

        /** The point on the canvas of the x origin. */
        let xOrig = canvas.width * 0.15;

        /** The point on the canvas of the y origin. */
        let yOrig = canvas.height * 0.9;

        /** The length of the x axis. */
        let xLen = canvas.width * 0.8;

        /** The length of the y axis. */
        let yLen = canvas.height * 0.8;

        /** A 2D array containing data for the secondary canvas. */
        let eventAreas = [];

        fix_dpi();

        var theData = //Insert array of (x,y) coordinate pairs.
        var xLabs = //Insert array of x-axis labels corresponding to the data.
        var yLabs = //Insert array of y-axis labels corresponding to the data.
        var range = //Insert range of data.
        var domain = //Insert domain of data.

        /** The width of the data bars. */
        let barW = yLen / (domain + 3);

        drawXTicks(xLabs);
        drawDataBars(theData, range, domain, barW, 0 - (barW / 2));
        drawYTicks(yLabs);
        drawAxes();

        /**
         * @@par Description:
         * Adds an event listener to the primary canvas which brings the 
         * secondary canvas to the front when the mouse moves within the 
         * chart's main area.
         * 
         * @@param evt - The mouse "move" event.
         * */
        canvas.addEventListener('mousemove', function (evt) {
            var mousePos = getMousePos(evt);
            if ((mousePos.x > xOrig) && (mousePos.x < (xOrig + xLen)) && (mousePos.y > (yOrig - yLen)) && (mousePos.y < yOrig)) {
                hcanvas.style.zIndex = 0;
            }
        });

        /**
         * @@par Description:
         * Adds an event listener to the secondary canvas which clears the 
         * canvas and then renders specific data for a bar over which the mouse 
         * hovering.  If mouse pointer falls outside the charts main area, 
         * hides the secondary canvas.
         *
         * @@param evt - The mouse "move" event.
         * */
        hcanvas.addEventListener('mousemove', function (evt) {
            var mousePos = getMousePos(evt);
            for (var i = 0; i <= domain; i++) {
                var lowX = xOrig;
                var highX = xOrig + xLen;
                var lowY = eventAreas[i][0];
                var highY = eventAreas[i][1];
                var value = eventAreas[i][3].toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 });
                if ((mousePos.x > lowX) && (mousePos.x < highX) && (mousePos.y > lowY) && (mousePos.y < highY)) {
                    renderTargetData(value, xOrig + xLen, lowY + (barW/2));
                    break;
                }
            }
            if ((mousePos.x <= xOrig) || (mousePos.x >= (xOrig + xLen)) || (mousePos.y <= (yOrig - yLen)) || (mousePos.y >= yOrig)) {
                hcanvas.style.zIndex = -1;
                console.log("out of canvas");
            }
        })

        /**
         * @@par Description:
         * Draws the lines and text on the secondary canvas which targets 
         * and displays specific data over which the mouse pointer is 
         * positioned.
         *
         * @@param message - The text showing the value of the targeted data 
         * bar.
         * @@param xPos - The x-position at which to render the text and area 
         * in which it is rendered.
         * @@param yPos - The y-position at which to render the text and area 
         * in which it is rendered.
         * */
        function renderTargetData(message, xPos, yPos) {
            var hctx = hcanvas.getContext('2d');
            hctx.clearRect(0, 0, hcanvas.width, hcanvas.height);
            hctx.save();
            hctx.beginPath();
            hctx.strokeStyle = 'black';
            hctx.moveTo(xPos, yPos - 13);
            hctx.lineTo(xPos - 125, yPos - 13);
            hctx.lineTo(xPos - 125, yPos + 12);
            hctx.lineTo(xPos, yPos + 12);
            hctx.lineTo(xPos, yPos - 13);
            hctx.stroke();
            hctx.restore();

            hctx.save();
            hctx.beginPath();
            hctx.strokeStyle = 'red';
            hctx.moveTo(xOrig, yPos);
            hctx.lineTo(xOrig + xLen, yPos);
            hctx.stroke();
            hctx.fillStyle = 'yellow';
            hctx.fillRect(xPos - 125, yPos - 13, 125, 25);
            hctx.restore();

            hctx.save();
            hctx.font = '16pt Times New Roman';
            hctx.fillStyle = 'black';
            hctx.textAlign = 'right';
            hctx.fillText(message, xPos, yPos + 10);
            hctx.restore();
        }

        /**
         * @@par Description:
         * Grabs and returns the x and y positions of the mouse pointer.
         *
         * @@param evt - The mouse event.
         * 
         * @@returns The x-y mouse pointer coordinate.
         * */
        function getMousePos(evt) {
            var rect = canvas.getBoundingClientRect();
            var x = evt.clientX - rect.left;
            var y = evt.clientY - rect.top;
            return { x, y };
        }

        /**
         * @@par Description:
         * Fixes the sharpness of the chart.
         * */
        function fix_dpi() {
            let style = {
                height() {
                    return +getComputedStyle(canvas).getPropertyValue('height').slice(0, -2);
                },
                width() {
                    return +getComputedStyle(canvas).getPropertyValue('width').slice(0, -2);
                },
                hheight() {
                    return +getComputedStyle(hcanvas).getPropertyValue('height').slice(0, -2);
                },
                hwidth() {
                    return +getComputedStyle(hcanvas).getPropertyValue('width').slice(0, -2);
                }
            }
            canvas.setAttribute('width', style.width() * dpi);
            canvas.setAttribute('height', style.height() * dpi);
            hcanvas.setAttribute('width', style.hwidth() * dpi);
            hcanvas.setAttribute('height', style.hheight() * dpi);
            xOrig = canvas.width * 0.15;
            yOrig = canvas.height * 0.90;
            xLen = canvas.width * 0.8;
            yLen = canvas.height * 0.8;
        }

        /**
         * @@par Description:
         * Draws the x and y axes.
         *
         * @@param color - The color of the axes.  Defaults to black, #000.
         * */
        function drawAxes(color = '#000') {
            ctx.save();
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.moveTo(xOrig, (yOrig - yLen));
            ctx.lineTo(xOrig, yOrig);
            ctx.lineTo((xOrig + xLen), yOrig);
            ctx.lineTo((xOrig + xLen), (yOrig - yLen));
            ctx.lineTo(xOrig, (yOrig - yLen));
            ctx.stroke();
            ctx.restore();
        }

        /**
         * @@par Description:
         * Draws the y-axis tick marks.
         *
         * @@param yLabs - An array containing the labels for the y-axis.
         * */
        function drawYTicks(yLabs) {
            ctx.save();
            let tickLen = canvas.height / 50;
            let yDivs = yLen / (yLabs.length + 1);
            let tickX = xOrig - tickLen / 2;
            let labX = xOrig - tickLen;

            ctx.beginPath();
            ctx.strokeStyle = '#000';
            ctx.fillStyle = '#000';
            ctx.font = '12px Times New Roman';
            ctx.textAlign = 'right';

            for (let i = 1; i <= yLabs.length; i++) {
                let tickY = yOrig - yDivs * i;
                ctx.moveTo(tickX, tickY);
                ctx.lineTo((tickX + tickLen), tickY);
            }
            for (let i = 1; i <= yLabs.length; i++) {
                let labY = yOrig - yDivs * i + 4;
                ctx.fillText(getShortLabel(yLabs[i-1]), labX, labY);
            }
            ctx.stroke();
            ctx.restore();
        }

        /**
         * @@par Description:
         * Draws the x-axis tick marks.
         *
         * @@param xLabs - An array containing the labels for the x-axis.
         * */
        function drawXTicks(xLabs) {
            ctx.save();
            let tickLen = canvas.height / 50;
            let xDivs = xLen / (xLabs.length - 1);

            ctx.beginPath();
            ctx.strokeStyle = '#000';
            for (let i = 0; i < xLabs.length; i++) {
                let tickX = xOrig + xDivs * i;
                let tickY = yOrig + tickLen / 2;
                ctx.moveTo(tickX, tickY);
                ctx.lineTo(tickX, (tickY - tickLen - yLen));
                ctx.fillText(xLabs[i], tickX - 15, tickY + 15);
            }
            ctx.stroke();
            ctx.restore();
        }

        /**
         * @@par Description:
         * Draws the data bars for a bar chart.
         *
         * @@param coords - An array containing the x-y coordinate pairs.
         * @@param maxX - The maximum (range) of the x-coordinates.
         * @@param maxY - The maximum (domain) of the y-coordinates.
         * @@param offCenter - The amount to offset the bars relative to the
         * axes tick marks (use for multiple bars, so they don't overlap).
         * Defaults to -5 pixels (5px left for horizontal chart, 5px up for
         * vertical chart).
         * @@param color - The color of the bars.  If no parameter passed in,
         * every bar will be a randomly chosen color.
         * */
        function drawDataBars(coords, maxX, maxY, barWidth, offCenter = -5, color = '') {
            ctx.save();
            if (coords.length >= 1) {
                let xScale = xLen / maxX;
                let yScale = yLen / (maxY + 2);
                let xp = xOrig + coords[0][0] * xScale;
                let yp = yOrig - coords[0][1] * yScale;
                if (color == '') {
                    ctx.beginPath();
                    for (let i = 0; i < coords.length; i++) {
                        xp = xOrig + coords[i][0] * xScale;
                        yp = yOrig - coords[i][1] * yScale - yScale;
                        ctx.fillStyle = getRandomColorForElement();
                        ctx.fillRect(xOrig, yp + offCenter, xp - xOrig, barWidth);
                        eventAreas.push([yp + offCenter, yp + offCenter + barWidth, xp, coords[i][0]]);
                    }
                }
                else {
                    ctx.beginPath();
                    ctx.fillStyle = color;
                    for (let i = 0; i < coords.length; i++) {
                        xp = xOrig + coords[i][0] * xScale;
                        yp = yOrig - coords[i][1] * yScale - yScale;
                        ctx.fillRect(xOrig, yp + offCenter, xp - xOrig, barWidth);
                        eventAreas.push([yp + offCenter, yp + offCenter + barWidth, xp, coords[i][0]]);
                    }
                }
            }
            ctx.restore();
        }

        /**
         * @@par Description:
         * Generates a random color (in hex).
         *
         * @@returns The color.
         * */
        function getRandomColorForElement() {
            var value = '#';
            for (var i = 1; i <= 6; i++) {
                var temp = String(Math.floor(Math.random() * 15));
                if (temp == 10) {
                    temp = 'A';
                }
                if (temp == 11) {
                    temp = 'B';
                }
                if (temp == 12) {
                    temp = 'C';
                }
                if (temp == 13) {
                    temp = 'D';
                }
                if (temp == 14) {
                    temp = 'E';
                }
                if (temp == 15) {
                    temp = 'F';
                }
                value = value + temp;
            }
            return value;
        }

        /**
         * @@par Description:
         * Generates a "short label" from the provided label.
         * 
         * @@param label - The original y label.
         *
         * @@returns A truncated version of the label parameter.
         * */
        function getShortLabel(label) {
            var shortLab = "";
            for (var i = 0; i < label.length; i++) {
                var symbol = label.charAt(i);
                if (symbol == ':') {
                    break;
                }
                else {
                    shortLab += symbol;
                }
            }
            return shortLab;
        }
    }