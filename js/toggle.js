(function() {
  var scdir,
    hold = false;
  var num_slides = 3,
    num_slides3 = 3,
    stepY = window.innerHeight / num_slides,
    stepX = window.innerWidth / num_slides3;

  function _scroll(obj) {
    // Смещения
    var offsetY = parseInt(obj.style.transform.split(",")[1]);
    var offsetX = parseInt(obj.style.transform.replace("translate(", ""));
    if (scdir === "up") {
      if (offsetY === -1 * stepY) {
        offsetY -= stepY;
        document.getElementById("toggle").style.transform = "translateY(0)";
      } else if (offsetY === 0) {
        offsetY -= stepY;
        document.getElementById("next_page").style.visibility = "hidden";
      }
    } else if (scdir === "down") {
      if (offsetY === -2 * stepY) {
        offsetY += stepY;
        document.getElementById("toggle").style.transform = "translateY(200px)";
      } else if (offsetY === -1 * stepY) {
        offsetY += stepY;
        setTimeout(function() {
          document.getElementById("next_page").style.visibility = "visible";
        }, 1000);
      }
    } else if (scdir === "right" && (offsetX === 0 || offsetX === stepX)) {
      offsetX += stepX;
    } else if (
      scdir === "left" &&
      (offsetX === 2 * stepX || offsetX === stepX)
    ) {
      offsetX -= stepX;
    }

    obj.style.transform = "translate(" + offsetX + "px, " + offsetY + "px)";
  }
  // СВАЙПЫ
  function _swipe(obj) {
    var swdir,
      sX,
      sY,
      dX,
      dY,
      threshold = 100,
      slack = 50,
      alT = 500,
      elT,
      stT;
    obj.addEventListener(
      "touchstart",
      function(e) {
        var tchs = e.changedTouches[0];
        swdir = "none";
        sX = tchs.pageX;
        sY = tchs.pageY;
        stT = new Date().getTime();
        //e.preventDefault();
      },
      false
    );

    obj.addEventListener(
      "touchmove",
      function(e) {
        e.preventDefault(); // prevent scrolling when inside slides
      },
      false
    );

    obj.addEventListener(
      "touchend",
      function(e) {
        var tchs = e.changedTouches[0];
        dX = tchs.pageX - sX;
        dY = tchs.pageY - sY;
        elT = new Date().getTime() - stT;
        if (elT <= alT) {
          if (Math.abs(dX) >= threshold && Math.abs(dY) <= slack) {
            swdir = dX < 0 ? "left" : "right";
          } else if (Math.abs(dY) >= threshold && Math.abs(dX) <= slack) {
            swdir = dY < 0 ? "up" : "down";
          }
          if (
            obj.id === "slides" &&
            parseInt(obj.style.transform.replace("translate(", "")) === 0
          ) {
            if (swdir === "up") {
              scdir = swdir;
              _scroll(obj);
            } else if (swdir === "down") {
              scdir = swdir;
              _scroll(obj);
            }
            e.stopPropagation();
          }
        }
      },
      false
    );
  }

  function dragElement(elmnt, obj) {
    var pos1 = 0,
      pos3 = 0,
      toggle = document.querySelector(".toggle"),
      line_width = parseInt(getComputedStyle(toggle).width),
      toggle_start =
        -parseInt(
          getComputedStyle(document.querySelector(".toggle_obj")).width
        ) / 2,
      toggle_end = line_width + toggle_start,
      toggle_center = (toggle_start + toggle_end) / 2,
      scroll_point1 = (toggle_start + toggle_end) / 4,
      scroll_point2 = (toggle_start + toggle_end) * 0.75,
      toggle_line = document.getElementById("toggle_line");
    toggle.addEventListener(
      "touchmove",
      function(e) {
        e.preventDefault();
      },
      false
    );
    elmnt.ontouchstart = dragMouseDown;

    function dragMouseDown(e) {
      e = e || window.event;
      elmnt.style.transition = "";
      toggle_line.style.transition = "";
      var tchs = e.changedTouches[0];

      // get the mouse cursor position at startup:
      pos3 = tchs.pageX;

      document.ontouchend = closeDragElement;
      // call a function whenever the cursor moves:
      document.ontouchmove = elementDrag;
    }

    function elementDrag(e) {
      e = e || window.event;
      var tchs = e.changedTouches[0];
      // calculate the new cursor position:
      pos1 = pos3 - tchs.pageX;
      pos3 = tchs.pageX;

      // set the element's new position:
      var new_pos = elmnt.offsetLeft - pos1;
      if (new_pos >= toggle_start && new_pos <= toggle_end) {
        scdir = pos1 < 0 ? "left" : "right";
        if (
          (new_pos <= scroll_point2 && elmnt.offsetLeft > scroll_point2) ||
          (new_pos <= scroll_point1 && elmnt.offsetLeft > scroll_point1) ||
          (new_pos >= scroll_point2 && elmnt.offsetLeft < scroll_point2) ||
          (new_pos >= scroll_point1 && elmnt.offsetLeft < scroll_point1)
        ) {
          _scroll(obj);
        }
        elmnt.style.left = new_pos + "px";
        // TOGGLE LINE
        toggle_line.style.width = new_pos - toggle_start + "px";
      }
    }

    function closeDragElement() {
      if (elmnt.offsetLeft <= scroll_point1) {
        elmnt.style.left = toggle_start + "px";
      } else if (elmnt.offsetLeft >= scroll_point2) {
        elmnt.style.left = toggle_end + "px";
      } else {
        elmnt.style.left = toggle_center + "px";
      }
      elmnt.style.transition = "1s cubic-bezier(0.5, 0, 0.5, 1)";
      // TOGGLE LINE
      toggle_line.style.width =
        parseInt(elmnt.style.left) - toggle_start + "px";
      toggle_line.style.transition = "1s cubic-bezier(0.5, 0, 0.5, 1)";
      document.ontouchend = null;
      document.ontouchmove = null;
    }
  }

  var slides = document.getElementById("slides");
  slides.style.transform = "translate(0, 0)";
  //   slides.addEventListener("wheel", function(e) {
  //     if (e.deltaY < 0) {
  //       scdir = "down";
  //     }
  //     if (e.deltaY > 0) {
  //       scdir = "up";
  //     }
  //     e.stopPropagation();
  //   });
  //   slides.addEventListener("wheel", function(e) {
  //     e.preventDefault();
  //     _scroll(this);
  //   });
  slides.addEventListener("wheel", function(e) {
    e.preventDefault();
  });

  _swipe(slides);
  dragElement(document.getElementById("toggle_obj"), slides);
})();

document.addEventListener("DOMContentLoaded", function() {
  if (window.location.href.includes("#slider")) {
    window.location.href = window.location.href.split("#")[0];
  }
  window.location.href += "#slider";
});
