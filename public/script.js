function updateClock() {
  var time = new Date();
  var hours = time.getHours();
  var minutes = time.getMinutes();
  var suffix = "AM";

  if (minutes < 10) {
    // prefix 0 
    minutes = "0" + minutes;
  }
  if (hours === 0) {
    hours = "12"
  } else if (hours === 12) {
    suffix = "PM";
  } else if (hours > 12) {
    hours = hours % 12;
    suffix = "PM";
  }

  var currentTime = hours + ":" + minutes + " " + suffix;
  $(".time").html(currentTime);
}

var getTopZIndex = function() {
  var allDivs = $('.window');
  var topZindex = 0;
  var topDivId;
  allDivs.each(function() {
    var currentZindex = parseInt($(this).css('z-index'));
    if (currentZindex > topZindex) {
      topZindex = currentZindex;
      topDivId = this.id;
    }
  });
  return topZindex;

};

var openWindow = function(id) {
  $("#" + id).show();
  $("#" + id).css('z-index', getTopZIndex() + 1);
};

//Dynamically create start bar button and unhide program window already loaded in dom 
var createProgram = function(id, title, imgUrl, url) {
  $("#startbutton").after("<span class='program' id='start-bar-" + id + "' >" + title + "</span>");
  $("#start-bar-" + id).css('background-image', 'url(' + imgUrl + ')');
  var content = '<div class="window" id="' + id + '"style="width: 350px; height: 250px">' +
  '<div class="title-bar">'+
  '<img class="window-header-icon" src="' + imgUrl + '" />' +
    '<div class="title-bar-text">'+title+'</div>'+
    '<div class="title-bar-controls">'+
      '<button aria-label="Minimize" class="minimise"></button>'+
      '<button aria-label="Maximize" class="maximise"></button>'+
      '<button aria-label="Close" class="close"></button>'+
    '</div>'+
  '</div>'+
  '<div class="window-content" id="' + id + '-content">' +
    '<iframe width="100%" height="100%" src="' + url + '" frameborder="0" allowfullscreen></iframe>'+
    '</div>'+
  '</div>'+
'</div>'
  $(".desktop").after(content);
  $(".window").draggable({
    handle: ".title-bar",
    cursor: "move",
    containment: "window",
    stack: ".window"
  });
  $(".window").resizable({
    handles: "n, e, s, w, ne, se, sw, nw",
    minHeight: 250,
    minWidth: 350
  });
  // Prevent windows from moving on sibling being resized or closed
  $(".window").css({
    position: "absolute"
  });
  openWindow(id);
};

var createTextProgram = function(id, title, text) {
  $("#startbutton").after("<span class='program' id='start-bar-" + id + "' >" + title + "</span>");
  $("#start-bar-" + id).css('background-image', 'url(https://win98icons.alexmeub.com/icons/png/notepad-3.png)');
  var content = '<div class="window" id="' + id + '"style="width: 350px; height: 250px">' +
  '<div class="title-bar">'+
  '<img class="window-header-icon" src="https://win98icons.alexmeub.com/icons/png/notepad-3.png" />' +
    '<div class="title-bar-text" style="float:left">'+title+' - Notepad</div>'+
    '<div class="title-bar-controls">'+
      '<button aria-label="Minimize" class="minimise"></button>'+
      '<button aria-label="Maximize" class="maximise"></button>'+
      '<button aria-label="Close" class="close"></button>'+
    '</div>'+
  '</div>'+
  '<div class="window-content" id="' + id + '-content" style="height: calc(100% - 52px) !important;">' +
  '<div style=" margin-top: 3px;margin-bottom: 3px;font-size: 15px;">'+
  '<span style="margin-left: 5px;"><span style="text-decoration:underline;">F</span>ile</span>'+
  '<span style="margin-left: 15px;"><span style="text-decoration:underline;">E</span>dit</span>'+
  '<span style="margin-left: 15px;"><span style="text-decoration:underline;">S</span>earch</span>'+
  '<span style="margin-left: 15px;"><span style="text-decoration:underline;">H</span>elp</span>'+
  '</div>'+
  '<div class="field-row-stacked" style="width: 100%; height:100%">'+
    '<textarea readonly id="text20" rows="8" style="width: 100%; height: 100%; resize: none; box-sizing:border-box; font-size: 15px">'+text+'</textarea>'+
  '</div>'
    '</div>'+
  '</div>'+
'</div>'
  $(".desktop").after(content);
  $(".window").draggable({
    handle: ".title-bar",
    cursor: "move",
    containment: "window",
    stack: ".window"
  });
  $(".window").resizable({
    handles: "n, e, s, w, ne, se, sw, nw",
    minHeight: 250,
    minWidth: 350
  });
  // Prevent windows from moving on sibling being resized or closed
  $(".window").css({
    position: "absolute"
  });
  openWindow(id);
};


var isWindowMaximised = function(id) {
  var targetId = $("#" + id);
  console.log("desktop width " + $(window).width());
  console.log("window width " + targetId.outerWidth());
  if (targetId.outerWidth() < $(window).width()) {
    return false;
  } else //(targetId.outerWidth() $(window).width) 
  {
    return true;
  }
}

var isWindowOpen = function(id) {

  if ($("#start-bar-" + id).length > 0) {
    return true;
    console.log("window open");
  } else {
    return false;
    console.log("window does not exist");

  }
};

var closeProgram = function(id) {
  $("#start-bar-" + id).remove();
  $("#" + id).remove();
};

var minimiseProgram = function(id) {
  $("#start-bar" + id).toggleClass("focused");
};

var maximiseWindow = function(id) {
  var targetId = $("#" + id);

  var originalPos = {
    left: targetId.position().left,
    top: targetId.position().top,
    width: targetId.width(),
    height: targetId.height()
  };

  targetId.draggable("disable");
  targetId.resizable("disable");

  targetId.data("top", originalPos.top);
  targetId.data("left", originalPos.left);
  targetId.data("height", originalPos.height);
  targetId.data("width", originalPos.width);

  targetId.css({
    top: 0,
    left: 0,
    width: $(window).width(),
    height: $(window).height() - 38
  });

};

var unMaximiseWindow = function(id) {
  var targetId = $("#" + id);

  targetId.draggable("enable");
  targetId.resizable("enable");

  targetId.css({
    top: targetId.data("top"),
    left: targetId.data("left"),
    width: targetId.data("width"),
    height: targetId.data("height")
  })
}

var setIcon = function() {
  if ($(this).data("icon")) {
    var icon = $(this).data("icon");
    $(this).css('background-image', "url(" + icon + ")");
  } else {
    console.log("no icon supplied")
  }

}

$(document).ready(function() {

  setInterval(updateClock(), 1000);
  //start up music
  var audio = new Audio('https://www.winhistory.de/more/winstart/ogg/win98.ogg');
  audio.play();
  // toggle start menu 
  $("#startbutton").click(function() {
    $("#startbutton").toggleClass("startbutton-on");
    $('#menu').toggle();
  });

  // close start menu if desktop clicked
  $(".desktop").click(function() {
    // Depress windows start button animation 
    $("#startbutton").removeClass("startbutton-on");
    // hide start menu 
    $('#menu').hide();
  });

  // bind event listeners to programs in task
  $(".startbar").on("click", ".program", function(event) {
    // identify program id that is currently clicked
    var id = $(this).attr('id');
    var windowId = id.substring(10);
    console.log(windowId);
    // is program window currently open? 
    if ($("#" + windowId).is(':visible')) {
      // window is open
      console.log(windowId + " is visible")
      var z = getTopZIndex();
      var windowZ = $("#" + windowId).css("z-index");
      console.log(windowZ)
        // is window top of stack on desktop?
      if ($("#" + windowId).css("z-index") == z) {
        // window is at the top
        console.log(windowId + " is at top of stack")
          // minimise window
        $("#" + windowId).hide();
      }
      if ($("#" + windowId).css("z-index") < z) {
        // window is open, but not at top. 
        console.log("else condition fired pepe show");
        // bring window to front
        openWindow(windowId);
      }
    } else {
      // window is minimised, open window, bring to front of stack.  
      openWindow(windowId);
    }
  });

  // bind closeProgram function to all windows. 
  $(document.body).on("click", ".close", function(event) {
    var target = $(this).parent().parent().parent();
    //console.log(target.attr('id'));
    var targetId = target.attr('id');
    closeProgram(targetId);
  });

  $(document.body).on("click", ".minimise", function(event) {
    var target = $(this).parent().parent().parent();
    console.log(target.attr('id'));
    var targetId = target.attr('id');
    $("#" + targetId).hide();
  });

  $(document.body).on("click", ".maximise", function(event) {
    var target = $(this).parent().parent().parent();
    var targetId = target.attr('id');
    console.log(targetId);
    if (!isWindowMaximised(targetId)) {
      maximiseWindow(targetId);
      console.log("maximising window");
    } else if (isWindowMaximised(targetId)) {
      unMaximiseWindow(targetId);
      console.log("unmaximise window");
    } else {
      console.log("error");
    }
  });

  // bring window to front of stack when clicked. 
  $(document.body).on("click", ".window", function(event) {
    var target = $(this).attr('id');
    var z = getTopZIndex();
    $("#" + target).css("z-index", z + 1);
    $(".program","#" + target).toggleClass("startbutton-on")
  });

  $("#menu").on("click", ".launch", function(event) {
    console.log($(this).data("launch"));
    var targetId = $(this).data("launch");
    var title = $(this).data("title");
    var imgUrl = $(this).data("icon");
    var url = $(this).data("url");
    if (!isWindowOpen(targetId)) {
      createProgram(targetId, title, imgUrl, url);
      $('#menu').hide();
      $("#startbutton").removeClass("startbutton-on");
    } else {
      openWindow(targetId);
      $('#menu').hide();
      $("#startbutton").removeClass("startbutton-on");
      console.log("program already exists... opening window")
    }
  });

  $("#menu").on("click", ".launch-text", function(event) {
    console.log($(this).data("launch"));
    var targetId = $(this).data("launch");
    var title = $(this).data("title");
    var text = $(this).data("text")
    if (!isWindowOpen(targetId)) {
      createTextProgram(targetId, title, text);
      $('#menu').hide();
      $("#startbutton").removeClass("startbutton-on");
    } else {
      openWindow(targetId);
      $('#menu').hide();
      $("#startbutton").removeClass("startbutton-on");
      console.log("program already exists... opening window")
    }
  });

  $(".item").each(function() {
    if ($(this).data("icon")) {
      var icon = $(this).data("icon");
      $(this).css('background-image', "url(" + icon + ")");
    } else {
      console.log("no icon supplied")
    }
  });

  $(".dropdown-item").each(function() {
    if ($(this).data("icon")) {
      var icon = $(this).data("icon");
      $(this).css('background-image', "url(" + icon + ")");
    } else {
      console.log("no icon supplied")
    }
  });

}); // end document ready
