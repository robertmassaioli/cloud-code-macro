define(['../helpers/PageContext', '../lib/highlight', '../lib/clipboard'], function(PC, highlight, Clipboard) {
   var pageContext = PC.load();

   var convertThemeName = function(themeName) {
      return themeName.replace(' ', '-').toLowerCase();
   };

   var selectTheme = function(themeName) {
      var linkThemeName = convertThemeName(themeName);
      $("link[title]").each(function(i, link) {
         link.disabled = (link.title != linkThemeName);
      });
   };

   AJS.$("#copy-to-clipboard").tooltip({
       gravity: 'n',
       trigger: 'manual'
   });
   
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

               // Setup the clipboard
               var clipboard = new Clipboard('#copy-to-clipboard');

               clipboard.on('success', function(e) {
                   e.clearSelection();

                   // Show the copied tooltip
                   var copyButton = AJS.$("#copy-to-clipboard");
                   copyButton.tooltip('show');
                   setTimeout(function() {
                      copyButton.tooltip('hide');
                      copyButton.blur();
                   }, 3000);
               });

               // Override the language if required
               macro.parameters = macro.parameters || {};
               if(macro.parameters.language) {
                  codeBlock.addClass(macro.parameters.language.value);
               }

               // Set the theme
               selectTheme('Default'); // Need to do this first for some reason
               macro.parameters.theme = macro.parameters.theme || { value: 'Github Gist' };
               selectTheme(macro.parameters.theme.value);

               // Enable the highlight and resize the iframe
               highlight.initHighlighting();

               AP.resize();
            }
         });
      });
   });
});
