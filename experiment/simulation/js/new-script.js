var simstatus = 0;
var rotstatus = 1;
//comments section
var commenttext = "Some Text";
var commentloc = 0;
//computing section
var trans = new point(150, 280);
var o = new point(0, 0, "");
var q = new point(0, 0, "");
var p = new point(0, 0, "P");
var tempPt = new point(0, 0, "");
var l = 40;
var theta = 240; // all angles to be defined either in degrees only or radians only throughout the program and convert as and when required
// All angles in Degrees. (mention the specification in the script like here)
var omega = 1.5; // angular velocity in rad/s
//graphics section
var canvas;
var ctx;
//timing section
var simTimeId = setInterval("", "1000");
var pauseTime = setInterval("", "1000");
var time = 0;
//point tracing section
var ptx = [];
var pty = [];
//click status of legend and quick reference
var legendCS = false;
var quickrefCS = false;
//temporary or dummy variables
var temp = 0;
var j = 20;
var forvar = 0;
/*
// for trials during development
function trythis()
{ 		alert();}
*/

//change simulation specific css content. e.g. padding on top of variable to adjust appearance in variables window
function editcss() {
  $(".variable").css("padding-top", "45px");
  $(".usercheck").css("left", "40px");
  //$('#legend').css("width",document.getElementById('legendimg').width+"px");
  //$('#quickref').css("height",document.getElementById('quickrefimg').height+"px");
}

//start of simulation here; starts the timer with increments of 0.1 seconds
function startsim() {
  simTimeId = setInterval("time=time+0.1; varupdate(); ", "100");
}

// switches state of simulation between 0:Playing & 1:Paused
function simstate() {
  var imgfilename = document.getElementById("playpausebutton").src;
  imgfilename = imgfilename.substring(
    imgfilename.lastIndexOf("/") + 1,
    imgfilename.lastIndexOf(".")
  );
  if (imgfilename == "bluepausedull") {
    document.getElementById("playpausebutton").src = "images/blueplaydull.svg";
    clearInterval(simTimeId);
    simstatus = 1;
    $("#thetaspinner").spinner("value", theta); //to set simulation parameters on pause
    pauseTime = setInterval("varupdate();", "100");
    document.querySelector(".playPause").textContent = "Play";
  }
  if (imgfilename == "blueplaydull") {
    time = 0;
    clearInterval(pauseTime);
    document.getElementById("playpausebutton").src = "images/bluepausedull.svg";
    simTimeId = setInterval("time=time+0.1; varupdate(); ", "100");
    simstatus = 0;
    document.querySelector(".playPause").textContent = "Pause";
  }
}

// switches state of rotation between 1:CounterClockWise & -1:Clockwise
function rotstate() {
  var imgfilename = document.getElementById("rotationbutton").src;
  imgfilename = imgfilename.substring(
    imgfilename.lastIndexOf("/") + 1,
    imgfilename.lastIndexOf(".")
  );
  if (imgfilename == "bluecwdull") {
    document.getElementById("rotationbutton").src = "images/blueccwdull.svg";
    rotstatus = -1;
  }
  if (imgfilename == "blueccwdull") {
    document.getElementById("rotationbutton").src = "images/bluecwdull.svg";
    rotstatus = 1;
  }
}

//Displaying Legend
/*
function showLegend()
{
	if(legendCS)
	{
		$('#legendicon').css('border', 'double');
		$('#legend').css('height', '0px');
		$('#legend').css('border', '0px');
		legendCS=false;	
	}
	else
	{
		$('#legendicon').css('border', 'inset red');
		$('#legend').css("height", document.getElementById('legendimg').height+"px");
		$('#legend').css('border', 'solid 1px');
		legendCS=true;	
	}
}
*/

//Initialise system parameters here
function varinit() {
  varchange();
  //Variable crank slider and number input types
  $("#crankslider").slider("value", 40);
  $("#crankspinner").spinner("value", 40);
  //Variable theta slider and number input types
  $("#thetaslider").slider("value", 240);
  $("#thetaspinner").spinner("value", 240);
  //Variable omega slider and number input types
  $("#omegaslider").slider("value", 1.5);
  $("#omegaspinner").spinner("value", 1.5);
}

// Initialise and Monitor variable containing user inputs of system parameters.
//change #id and repeat block for new variable. Make sure new <div> with appropriate #id is included in the markup
function varchange() {
  //Variable crank slider and number input types
  $("#crankslider").slider({ max: 100, min: 10, step: 2 }); // slider initialisation : jQuery widget
  $("#crankspinner").spinner({ max: 100, min: 10, step: 1 }); // number initialisation : jQuery widget
  // monitoring change in value and connecting slider and number
  // setting trace point coordinate arrays to empty on change of link length
  $("#crankslider").on("slide", function (e, ui) {
    $("#crankspinner").spinner("value", ui.value);
    j = 20;
    ptx = [];
    pty = [];
  });
  $("#crankspinner").on("spin", function (e, ui) {
    $("#crankslider").slider("value", ui.value);
    j = 20;
    ptx = [];
    pty = [];
  });
  $("#crankspinner").on("change", function () {
    varchange();
  });

  //Variable theta slider and number input types
  $("#thetaslider").slider({ max: 360, min: 0, step: 2 }); // slider initialisation : jQuery widget
  $("#thetaspinner").spinner({ max: 360, min: 0, step: 2 }); // number initialisation : jQuery widget
  // monitoring change in value and connecting slider and number
  // setting trace point coordinate arrays to empty on change of link length
  $("#thetaslider").on("slide", function (e, ui) {
    $("#thetaspinner").spinner("value", ui.value);
  });
  $("#thetaspinner").on("spin", function (e, ui) {
    $("#thetaslider").slider("value", ui.value);
  });
  $("#thetaspinner").on("change", function () {
    varchange();
  });

  //Variable omega slider and number input types
  $("#omegaslider").slider({ max: 2, min: 0.02, step: 0.01 }); // slider initialisation : jQuery widget
  $("#omegaspinner").spinner({ max: 2, min: 0.02, step: 0.01 }); // number initialisation : jQuery widget
  // monitoring change in value and connecting slider and number
  // setting trace point coordinate arrays to empty on change of link length
  $("#omegaslider").on("slide", function (e, ui) {
    $("#omegaspinner").spinner("value", ui.value);
    j = 20;
    ptx = [];
    pty = [];
  });
  $("#omegaspinner").on("spin", function (e, ui) {
    $("#omegaslider").slider("value", ui.value);
    j = 20;
    ptx = [];
    pty = [];
  });
  $("#omegaspinner").on("change", function () {
    varchange();
  });

  varupdate();
}

//Computing of various system parameters
function varupdate() {
  $("#crankslider").slider("value", $("#crankspinner").spinner("value")); //updating slider location with change in spinner(debug)
  $("#thetaslider").slider("value", $("#thetaspinner").spinner("value"));
  $("#omegaslider").slider("value", $("#omegaspinner").spinner("value"));
  l = $("#crankspinner").spinner("value");

  printcomment("Simple Harmonic Motion <br> s = A * cos( ω t )", 1);

  if (!simstatus) {
    $("#omegaslider").slider("enable");
    $("#omegaspinner").spinner("enable");
    omega = $("#omegaspinner").spinner("value");
    $("#thetaslider").slider("disable");
    $("#thetaspinner").spinner("disable");
    theta += rotstatus * 0.1 * deg(omega);
    theta = theta % 360;
    printcomment("", 2);
  }
  if (simstatus) {
    $("#thetaslider").slider("enable");
    $("#thetaspinner").spinner("enable");
    $("#omegaslider").slider("disable");
    $("#omegaspinner").spinner("disable");
    theta = $("#thetaspinner").spinner("value");
    printcomment(
      "Displacement (mm) <br> s = " +
        l +
        " &times; cos(" +
        theta +
        "&deg;)  = " +
        roundd(l * Math.cos(rad(theta)), 2),
      2
    );
  }

  o.xcoord = 0;
  o.ycoord = 0;
  q.xcoord = o.xcoord + l * Math.cos(rad(theta));
  q.ycoord = o.ycoord + l * Math.sin(rad(theta));

  draw();
}

//Simulation graphics
function draw() {
  canvas = document.getElementById("simscreen");
  ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, 550, 400); //clears the complete canvas#simscreen everytime

  o = pointtrans(o, trans);
  q = pointtrans(q, trans);
  ctx.save();
  ctx.lineWidth = 1;
  ctx.font = "14px 'Nunito', sans-serif";
  ctx.fillStyle = "#000000";
  ctx.fillText("Position Analysis", 15, 15);
  ctx.restore();
  //ptx.push(p.xcoord);
  //pty.push(p.ycoord);
  disprem(ctx);
  pointjoin(o, q, ctx, "#DE4100", 10);
  pointdisp(o, ctx, 2, "black", "#003366", 1);
  pointdisp(q, ctx, 6, "black", "#003366", 1);
  dispyoke(ctx);
  graph(ctx);
}
//function displaying the pivot of rotating link and the horizontal base
function disprem(context) {
  context.beginPath();
  context.strokeStyle = "#BF5000";
  context.lineWidth = 10;
  context.globalAlpha = 0.5;
  context.lineCap = "round";
  context.moveTo(30, o.ycoord + 15);
  context.lineTo(450, o.ycoord + 15);
  context.stroke();
  context.closePath();

  context.beginPath();
  context.strokeStyle = "#BF4400";
  context.lineWidth = 15;
  context.globalAlpha = 0.7;
  context.lineCap = "round";
  context.moveTo(o.xcoord, o.ycoord + 10);
  context.lineTo(o.xcoord, o.ycoord);
  context.stroke();
  context.closePath();

  context.beginPath();
  context.strokeStyle = "#BF4400";
  context.lineWidth = 15;
  context.globalAlpha = 1;
  context.lineCap = "butt";
  context.moveTo(o.xcoord - 15, o.ycoord + 15);
  context.lineTo(o.xcoord + 15, o.ycoord + 15);
  context.stroke();
  context.closePath();
}

//function to display yoke
function dispyoke(context) {
  context.lineCap = "round";
  tempPt.xcoord = q.xcoord;
  tempPt.ycoord = o.ycoord;
  drawrect(tempPt, 20, 2 * l + 20, 1, context, "#812929", "", 10);
  tempPt.xcoord = q.xcoord + 80;
  tempPt.ycoord = o.ycoord;
  drawrect(tempPt, 130, 20, 0, context, "#812929", "#812929", 1);
  context.beginPath();
  context.moveTo(q.xcoord, o.ycoord - l);
  context.strokeStyle = "#812929";
  context.globalAlpha = 0.6;
  context.lineWidth = 10;
  context.lineTo(q.xcoord, o.ycoord + l);
  context.stroke();
  context.closePath();
  context.globalAlpha = 1;
}

function checkGraph() {
  if (document.getElementById("graphPlot").checked == false) {
    document.getElementById("graphPlot").checked = true;
    graph(context);
  } else {
    document.getElementById("graphPlot").checked = false;
  }
}
//function for graph plotting
function graph(context) {
  if (document.getElementById("graphPlot").checked == true) {
    if (!simstatus) {
      ptx.push(q.xcoord + 145);
      //ptxdot.push(o.xcoord+145-(pt2y*omega*Math.PI/180));
      //ptxddot.push(pt1x+145-(pt2x*Math.pow((omega*Math.PI/180),2)));
      pty.push(o.ycoord - j);
      j = j + 1;
    }

    tempPt.xcoord = q.xcoord + 145;
    tempPt.ycoord = o.ycoord;
    pointdisp(tempPt, context, 3, "#000000", "#336699", "");
    context.lineWidth = 1;
    context.strokeStyle = "#000";
    context.moveTo(q.xcoord + 145, o.ycoord);
    if (pty.length < 230) context.lineTo(q.xcoord + 145, pty[pty.length - 1]);
    else context.lineTo(q.xcoord + 145, pty[230]);
    context.stroke();

    context.beginPath();
    context.lineWidth = 1;
    context.strokeStyle = "#000000";
    context.font = "14px 'Nunito', sans-serif";
    context.moveTo(o.xcoord + 145, o.ycoord);
    context.lineTo(o.xcoord + 145, o.ycoord - 300);
    context.fillText("Time", o.xcoord + 145, o.ycoord - 265);
    context.moveTo(o.xcoord, pty[0]);
    context.lineTo(o.xcoord + 300, pty[0]);
    context.fillText("Amplitude", o.xcoord + 300, pty[0] - 10);
    context.fillText("+100", o.xcoord + 145 + 100, pty[0] - 10);
    context.fillText("-100", o.xcoord + 145 - 100, pty[0] - 10);

    for (
      forvar = 0;
      forvar <= 100;
      forvar += 20 //amplitude axis marking
    ) {
      context.moveTo(o.xcoord + 145 - forvar, pty[0] + 2.5);
      context.lineTo(o.xcoord + 145 - forvar, pty[0] - 2.5);
      context.moveTo(o.xcoord + 145 + forvar, pty[0] + 2.5);
      context.lineTo(o.xcoord + 145 + forvar, pty[0] - 2.5);
    }
    context.stroke();
    context.closePath();
    plotgraph(ptx, pty, context, 230);
  } else {
    ptx = [];
    //	ptxdot=[];
    //	ptxddot=[];
    pty = [];
    j = 20;
    ptx.push(q.xcoord + 145);
    pty.push(o.ycoord - j);
  }
}

// prints comments passed as 'commenttext' in location specified by 'commentloc' in the comments box;
// 0 : Single comment box, 1 : Left comment box, 2 : Right comment box
function printcomment(commenttext, commentloc) {
  if (commentloc == 0) {
    document.getElementById("commentboxright").style.visibility = "hidden";
    document.getElementById("commentboxleft").style.width = "570px";
    document.getElementById("commentboxleft").innerHTML = commenttext;
  } else if (commentloc == 1) {
    document.getElementById("commentboxright").style.visibility = "visible";
    document.getElementById("commentboxleft").style.width = "285px";
    document.getElementById("commentboxleft").innerHTML = commenttext;
  } else if (commentloc == 2) {
    document.getElementById("commentboxright").style.visibility = "visible";
    document.getElementById("commentboxleft").style.width = "285px";
    document.getElementById("commentboxright").innerHTML = commenttext;
  } else {
    document.getElementById("commentboxright").style.visibility = "hidden";
    document.getElementById("commentboxleft").style.width = "570px";
    document.getElementById("commentboxleft").innerHTML =
      "<center>please report this issue to adityaraman@gmail.com</center>";
    // ignore use of deprecated tag <center> . Code is executed only if printcomment function receives inappropriate commentloc value
  }
}
