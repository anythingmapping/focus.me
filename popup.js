// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.


"use strict";
  
var bigTime = 1499; // time in seconds
var mode = "normal";
var animation = "fadeToBlack";

var color = "0D5B85";
var percent;

var mins;
var secs;

var countdownID;

// get all the elements
var minutes = document.getElementById("minutes");
var seconds = document.getElementById("seconds");
var message = document.getElementById("message");

var test = document.getElementById("test");

// register the buttons
var start = document.getElementById("start");
start.addEventListener("click", startTimer, false);  

var stop = document.getElementById("stop");
stop.addEventListener("click", stopTimer, false);

var reset = document.getElementById("reset");  
reset.addEventListener("click", resetTimer, false);

// COUNTER ========================================================
function counter() {
  
  // calculate the minutes and seconds from bigTime
  mins = Math.floor(bigTime / 60);
  secs = bigTime - mins * 60;

  // change the HTML to show new minutes and seconds
  minutes.innerHTML = (mins < 10 ? '0' : '') + mins;
  seconds.innerHTML = (secs < 10 ? '0' : '') + secs;
  
  // handle the animations
    var divisor = 300;
  
    percent = secs / divisor;
    color = shadeColor(color, -percent);
    document.body.style.background = "#" + color;
    test.innerHTML = color;
    divisor - 100;
  
  // change the message at 00
  if (secs == 0) {
    message.innerHTML = "change out the messages";
  }
  
  // switch modes if timer ends
  if (bigTime == 0) {
    
    if (mode == "normal") {
      
      // cooldown is 5min 
      mode = "cooldown";    
      bigTime = 300;
      
    } else if (mode == "cooldown") {
      
      // switch back to normal 25min mode
      mode = "normal";    
      bigTime = 1499;  
      
      minutes.innerHTML = "25";
      seconds.innerHTML = "00";
      
      document.body.style.background = "#" + color;
      
      // show start button
      start.style.display = "block"; 
      stop.style.display = "none"; 
      reset.style.display = "none"; 
      
      // stop timer
      clearInterval(countdownID);
    }    
     
  } else {
    // decrement
    bigTime = bigTime - 1; 
  }
        
}

// ACTIONS =======================================================

// start timer
function startTimer() {
  // start timer
  countdownID = setInterval("counter()", 10);
  
  // show message
  message.innerHTML = "slow and steady wins something";
  
  // show stop button
  start.style.display = "none"; 
  stop.style.display = "block"; 
  reset.style.display = "none"; 
} 

// stop timer
function stopTimer() {
  // change message
  message.innerHTML = "why are you such a quitter";
  
  // stop timer
  clearInterval(countdownID);
  
  // show reset button
  start.style.display = "none"; 
  stop.style.display = "none"; 
  reset.style.display = "block"; 
}

// reset timer
function resetTimer() {
  // reset big time
  bigTime = 1499;
  
  // change message
  message.innerHTML = "keep up the good work";
  
  // show start button
  start.style.display = "block"; 
  stop.style.display = "none"; 
  reset.style.display = "none"; 
}

// ANIMATIONS ================================================ 
function fadeToBlack() {
  
}

function colorChange() {
  
}

// HELPER FUNCTIONS ============================================ 
function shadeColor(color, percent) {   
    var num = parseInt(color,16),
    amt = Math.round(2.55 * percent),
    R = (num >> 16) + amt,
    B = (num >> 8 & 0x00FF) + amt,
    G = (num & 0x0000FF) + amt;
    return (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (B < 255 ? B < 1 ? 0 : B : 255) * 0x100 + (G < 255 ? G < 1 ? 0 : G : 255)).toString(16).slice(1);
}



// /**
//  * Get the current URL.
//  *
//  * @param {function(string)} callback - called when the URL of the current tab
//  *   is found.
//  */
// function getCurrentTabUrl(callback) {
//   // Query filter to be passed to chrome.tabs.query - see
//   // https://developer.chrome.com/extensions/tabs#method-query
//   var queryInfo = {
//     active: true,
//     currentWindow: true
//   };

//   chrome.tabs.query(queryInfo, function(tabs) {
//     // chrome.tabs.query invokes the callback with a list of tabs that match the
//     // query. When the popup is opened, there is certainly a window and at least
//     // one tab, so we can safely assume that |tabs| is a non-empty array.
//     // A window can only have one active tab at a time, so the array consists of
//     // exactly one tab.
//     var tab = tabs[0];

//     // A tab is a plain object that provides information about the tab.
//     // See https://developer.chrome.com/extensions/tabs#type-Tab
//     var url = tab.url;

//     // tab.url is only available if the "activeTab" permission is declared.
//     // If you want to see the URL of other tabs (e.g. after removing active:true
//     // from |queryInfo|), then the "tabs" permission is required to see their
//     // "url" properties.
//     console.assert(typeof url == 'string', 'tab.url should be a string');

//     callback(url);
//   });

//   // Most methods of the Chrome extension APIs are asynchronous. This means that
//   // you CANNOT do something like this:
//   //
//   // var url;
//   // chrome.tabs.query(queryInfo, function(tabs) {
//   //   url = tabs[0].url;
//   // });
//   // alert(url); // Shows "undefined", because chrome.tabs.query is async.
// }

// /**
//  * @param {string} searchTerm - Search term for Google Image search.
//  * @param {function(string,number,number)} callback - Called when an image has
//  *   been found. The callback gets the URL, width and height of the image.
//  * @param {function(string)} errorCallback - Called when the image is not found.
//  *   The callback gets a string that describes the failure reason.
//  */
// function getImageUrl(searchTerm, callback, errorCallback) {
//   // Google image search - 100 searches per day.
//   // https://developers.google.com/image-search/
//   var searchUrl = 'https://ajax.googleapis.com/ajax/services/search/images' +
//     '?v=1.0&q=' + encodeURIComponent(searchTerm);
//   var x = new XMLHttpRequest();
//   x.open('GET', searchUrl);
//   // The Google image search API responds with JSON, so let Chrome parse it.
//   x.responseType = 'json';
//   x.onload = function() {
//     // Parse and process the response from Google Image Search.
//     var response = x.response;
//     if (!response || !response.responseData || !response.responseData.results ||
//         response.responseData.results.length === 0) {
//       errorCallback('No response from Google Image search!');
//       return;
//     }
//     var firstResult = response.responseData.results[0];
//     // Take the thumbnail instead of the full image to get an approximately
//     // consistent image size.
//     var imageUrl = firstResult.tbUrl;
//     var width = parseInt(firstResult.tbWidth);
//     var height = parseInt(firstResult.tbHeight);
//     console.assert(
//         typeof imageUrl == 'string' && !isNaN(width) && !isNaN(height),
//         'Unexpected respose from the Google Image Search API!');
//     callback(imageUrl, width, height);
//   };
//   x.onerror = function() {
//     errorCallback('Network error.');
//   };
//   x.send();
// }

// function renderStatus(statusText) {
//   document.getElementById('status').textContent = statusText;
// }

// document.addEventListener('DOMContentLoaded', function() {
//   getCurrentTabUrl(function(url) {
//     // Put the image URL in Google search.
//     renderStatus('Performing Google Image search for ' + url);

//     getImageUrl(url, function(imageUrl, width, height) {

//       renderStatus('Search term: ' + url + '\n' +
//           'Google image search result: ' + imageUrl);
//       var imageResult = document.getElementById('image-result');
//       // Explicitly set the width/height to minimize the number of reflows. For
//       // a single image, this does not matter, but if you're going to embed
//       // multiple external images in your page, then the absence of width/height
//       // attributes causes the popup to resize multiple times.
//       imageResult.width = width;
//       imageResult.height = height;
//       imageResult.src = imageUrl;
//       imageResult.hidden = false;

//     }, function(errorMessage) {
//       renderStatus('Cannot display image. ' + errorMessage);
//     });
//   });
// });
