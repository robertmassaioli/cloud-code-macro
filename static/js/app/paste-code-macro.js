define(['../helpers/PageContext', '../helpers/MustacheLoader', '../lib/highlight', '../lib/clipboard'], function(PC, ML, highlight, Clipboard) {
   var pageContext = PC.load();
   var templates = ML.load();

   function isBlank(str) {
       return (!str || /^\s*$/.test(str));
   }

   var convertThemeName = function(themeName) {
      return themeName.replace(' ', '-').toLowerCase();
   };

   var selectTheme = function(themeName) {
      var linkThemeName = convertThemeName(themeName);
      $("link[title]").each(function(i, link) {
         link.disabled = (link.title != linkThemeName);
      });
   };

   $.getScript(pageContext.productBaseUrl + '/atlassian-connect/all.js', function() {
      AP.confluence.getMacroBody(function(body){
         console.log(body);
         AP.confluence.getMacroData(function(data) {
            data = data || {};
            // Put the body in the code block
            var pasteData = {
                contents: body
            };

            // Optionally set the title
            var title = pageContext.macro.title || data.title || '';
            if(!isBlank(title)) {
                pasteData.title = title;
            }

            // Set the language
            pasteData.language = pageContext.macro.language || data.language || 'bash';

            AJS.$("#content").append(templates.render('paste', pasteData));

            // Setup the clipboard
            AJS.$("#copy-to-clipboard").tooltip({
                gravity: 'n',
                trigger: 'manual'
            });

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

            // Set the theme
            selectTheme('Default'); // Need to do this first for some reason
            var theme = pageContext.macro.theme || data.theme || 'Github Gist';
            selectTheme(theme);

            // Enable the highlight and resize the iframe
            highlight.initHighlighting();

            AP.resize();
         });
      });
   });
});
