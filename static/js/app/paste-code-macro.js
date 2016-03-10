define(['../helpers/PageContext', '../lib/highlight'], function(PC, highlight) {
   var pageContext = PC.load();
   
   $.getScript(pageContext.productBaseUrl + '/atlassian-connect/all.js', function() {
      AP.require('request', function(request) {
         request({
            url: '/rest/api/content/' + pageContext.page.id + '/history/' + pageContext.page.version + '/macro/id/' + pageContext.macro.id,
            success: function(response) {
               var macro = JSON.parse(response);

               console.log("Macro body: " + macro.body);
               AJS.$("#code-preview").text(macro.body);
               highlight.initHighlighting();
               AP.resize();
            }
         });
      });
   });
});
