define(['../helpers/PageContext', '../lib/highlight'], function(PC, highlight) {
   var pageContext = PC.load();
   
   $.getScript(pageContext.productBaseUrl + '/atlassian-connect/all.js', function() {
      AP.require('request', function(request) {
         request({
            url: '/rest/api/content/' + pageContext.page.id + '/history/' + pageContext.page.version + '/macro/id/' + pageContext.macro.id,
            success: function(response) {
               // Parse the data
               var macro = JSON.parse(response);

               // Put the body in the code block
               var codeBlock = AJS.$("#code-preview");
               codeBlock.text(macro.body);

               // Override the language if required
               macro.parameters = macro.parameters || {};
               if(macro.parameters.language) {
                  codeBlock.addClass(macro.parameters.language.value);
               }

               // Enable the highlight and resize the iframe
               highlight.initHighlighting();
               AP.resize();
            }
         });
      });
   });
});
