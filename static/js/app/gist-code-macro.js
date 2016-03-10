define(['../helpers/PageContext'], function(PC) {
   var pageContext = PC.load();
   
   $.getScript(pageContext.productBaseUrl + '/atlassian-connect/all.js', function() {
      AP.resize();
      /*
      AP.require('request', function(request) {
         request({
            url: '/rest/api/content/' + pageContext.page.id + '/history/' + pageContext.page.version + '/macro/id/' + pageContext.macro.id,
            success: function(response) {
               // Parse the data
               var macro = JSON.parse(response);

               // Override the language if required
               macro.parameters = macro.parameters || {};
               if(macro.parameters.gistUrl) {
                  $.getScript(macro.parameters.gistUrl.value + '.js').done(function() {
                     AP.resize();
                  });
               } else {
                  // TODO show an error because you failed to load the gist
               }

            }
         });
      });
      */
   });
});
