var APP=APP||{};APP=function(){var t="https://teams.deloitte.com/sites/FDAJDD/Sandbox/";return{getURL:function(){return t},getData:function(t,e){var n,a;(n=new XMLHttpRequest).open(t,e),n.onreadystatechange=function(){4===n.readyState&&200===n.status&&(a=JSON.parse(n.responseText),console.log(a))},n.send()}}}();