define(['../helpers/PageContext'], function(PC) {
   var pageContext = PC.load();

   $.getScript('https://connect-cdn.atl-paas.net/all.js', function() {
      AP.resize();
   });
});
