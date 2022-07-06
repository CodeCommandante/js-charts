let canvas = document.getElementById('canvas'), ctx = canvas.getContext('2d'), dpi = window.devicePixelRatio;
let xOrig = canvas.width * 0.15;
let yOrig = canvas.height * 0.85;
let xLen = canvas.width * 0.7;
let yLen = canvas.height * 0.7;

function fix_dpi() {
    let style = {
        height() {
            return +getComputedStyle(canvas).getPropertyValue('height').slice(0, -2);
        },
        width() {
            return +getComputedStyle(canvas).getPropertyValue('width').slice(0, -2);
        }
    }
    canvas.setAttribute('width', style.width() * dpi);
    canvas.setAttribute('height', style.height() * dpi);
    xOrig = canvas.width * 0.15;
    yOrig = canvas.height * 0.85;
    xLen = canvas.width * 0.7;
    yLen = canvas.height * 0.7;
}

function draw() {
    fix_dpi();  //fixes dpi for sharper image...

    var dataSet = [];  //2D int array
    var xLabs = [];  //1D string array
    var yLabs = [];  //1D string array
    var range = 0;  //integer
    var domain = 0;  //integer

    console.log(xLabs);
    console.log(xLabs.length);
    console.log(yLabs);
    console.log(yLabs.length);

    drawChartTitle("My Chart Title");
    fillDataSpace(dataSet, range, domain, '#3F3');
    drawDataLine(dataSet, range, domain, '#000');
    drawDataPoints(dataSet, range, domain, '#F00');
    drawXTicks(xLabs);
    drawYTicks(yLabs);
    drawAxes();
}

function drawChartTitle(title) {
    ctx.save();
    ctx.fillStyle = '#000';
    ctx.font = '24px Times New Roman';
    ctx.textAlign = 'center';
    ctx.fillText(title, canvas.width / 2, canvas.height * 0.1);
    ctx.restore();
}

function drawAxes(color = '#000') {
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.moveTo(xOrig, (yOrig - yLen));
    ctx.lineTo(xOrig, yOrig);
    ctx.lineTo((xOrig + xLen), yOrig);
    ctx.stroke();
    ctx.restore();
}

function drawYTicks(yLabs) {
    ctx.save();
    let tickLen = canvas.height / 50;
    let yDivs = yLen / (yLabs.length - 1);
    let tickX = xOrig - tickLen / 2;
    let labX = xOrig - tickLen;

    ctx.beginPath();
    ctx.strokeStyle = '#000';
    ctx.fillStyle = '#000';
    ctx.font = '12px Times New Roman';
    ctx.textAlign = 'right';

    if (yLabs.length >= 2) {
        yDivs = yLen / (yLabs.length - 1);
        //Draw million dollar ticks and labels
        for (let i = 0; i < yLabs.length; i++) {
            let tickY = yOrig - yDivs * (i);
            ctx.moveTo(tickX, tickY);
            ctx.lineTo((tickX + tickLen), tickY);
        }
        for (let i = 0; i < yLabs.length; i++) {
            let labY = yOrig - yDivs * (i) + 4;
            ctx.fillText(yLabs[i], labX, labY);
        }
    }

    ctx.stroke();
    ctx.restore();
}

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
        ctx.lineTo(tickX, (tickY - tickLen));
    }
    ctx.stroke();
    ctx.restore();

    for (let i = 0; i < xLabs.length; i++) {
        ctx.save();
        ctx.fillStyle = '#000';
        ctx.font = '12px Times New Roman';
        ctx.textAlign = 'right';
        ctx.translate((canvas.width * 0.15) + (xDivs * i), canvas.height * 0.15);
        ctx.rotate(-Math.PI / 4);
        let labY = canvas.height * 0.52;
        let labX = -canvas.width * 0.38;
        ctx.fillText(xLabs[i], labX, labY);
        ctx.restore();
    }
}

function drawDataPoints(coords, maxX, maxY, color = '#000') {
    ctx.save();
    if (coords.length >= 2) {
        let xScale = xLen / maxX;
        let yScale = yLen / maxY;
        let pointCir = canvas.height / 200;

        ctx.beginPath();
        for (let i = 0; i < coords.length; i++) {
            let xp = xOrig + coords[i][0] * xScale;
            let yp = yOrig - coords[i][1] * yScale;

            ctx.moveTo(xp, yp);
            ctx.arc(xp, yp, pointCir, 0, Math.PI * 2);
        }
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = color;
        ctx.stroke();
    }
    else {
        ctx.fillStyle = '#000';
        ctx.font = '24px Sans-Serif';

        ctx.fillText('There is no data to display', (xOrig + xLen * 0.3), (yOrig - yLen * 0.5));
    }
    ctx.restore();
}

function drawDataLine(coords, maxX, maxY, color = '#000') {
    ctx.save();
    if (coords.length >= 2) {
        let xScale = xLen / maxX;
        let yScale = yLen / maxY;
        let xp = xOrig + coords[0][0] * xScale;
        let yp = yOrig - coords[0][1] * yScale;

        ctx.beginPath();
        ctx.moveTo(xp, yp);
        for (let i = 1; i < coords.length; i++) {
            xp = xOrig + coords[i][0] * xScale;
            yp = yOrig - coords[i][1] * yScale;

            ctx.lineTo(xp, yp);
        }
        ctx.strokeStyle = color;
        ctx.stroke();
    }
    else {
        ctx.fillStyle = '#000';
        ctx.font = '24px Sans-Serif';

        ctx.fillText('There is no data to display', (xOrig + xLen * 0.3), (yOrig - yLen * 0.5));
    }
    ctx.restore();
}

function fillDataSpace(coords, maxX, maxY, color = '#00F') {
    ctx.save();
    if (coords.length >= 2) {
        let xScale = xLen / maxX;
        let yScale = yLen / maxY;
        let xp = xOrig + coords[0][0] * xScale;
        let yp = yOrig - coords[0][1] * yScale;

        var lingrad = ctx.createLinearGradient(xOrig, yOrig - yLen, xOrig + xLen, yOrig);
        lingrad.addColorStop(0, '#FFF');
        lingrad.addColorStop(0.5, color);
        lingrad.addColorStop(1, '#FFF');

        ctx.beginPath();
        ctx.moveTo(xp, yp);
        for (let i = 1; i < coords.length; i++) {
            xp = xOrig + coords[i][0] * xScale;
            yp = yOrig - coords[i][1] * yScale;

            ctx.lineTo(xp, yp);
        }
        ctx.lineTo(xOrig + xLen, yOrig);
        ctx.lineTo(xOrig, yOrig);
        ctx.closePath();
        ctx.strokeStyle = lingrad;
        ctx.stroke();
        ctx.fillStyle = lingrad;
        ctx.fill();
    }
    else {
        ctx.fillStyle = '#000';
        ctx.font = '24px Sans-Serif';

        ctx.fillText('There is no data to display', (xOrig + xLen * 0.3), (yOrig - yLen * 0.5));
    }
    ctx.restore();
}
