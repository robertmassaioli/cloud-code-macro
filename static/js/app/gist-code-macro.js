define(['../helpers/PageContext'], function(PC) {
   var pageContext = PC.load();
   
   $.getScript(pageContext.productBaseUrl + '/atlassian-connect/all.js', function() {
      AP.resize();
   });
});
