define(['../helpers/PageContext', '../helpers/MustacheLoader', '../lib/highlight', '../lib/URI', 'underscore'], function(PC, ML, highlight, URI, _) {
   var pageContext = PC.load();
   var templates = ML.load();

   // Get the snippet url
   var rawSnippetUrl = AJS.$("meta[name='snippet-url']").attr('content');
   var snippetUrl = URI(rawSnippetUrl);

   // Generate the api url for this snippet
   var apiUrl = snippetUrl.segmentCoded([
      '!api',
      '2.0',
      snippetUrl.segmentCoded(0),
      snippetUrl.segmentCoded(1),
      snippetUrl.segmentCoded(2)
   ]);

   var apiRequest = AJS.$.ajax({
      url: apiUrl,
      type: 'GET',
      cache: true,
      dataType: 'json',
      crossDomain: true,
      xhrFields: {
         withCredentials: false
      }
   });

   var allJs = $.getScript('https://connect-cdn.atl-paas.net/all.js');

   apiRequest.done(function(data) {
      var rawRequests = [];
      var rawData = [];
      // Request all of the contents of all of the files and save their data
      AJS.$.each(_.allKeys(data.files), function(i, filename) {
         var thisFile = data.files[filename];
         var rawDataRequest = AJS.$.ajax({
            url: thisFile.links.self.href,
            type: 'GET',
            cache: true,
            dataType: 'text',
            crossDomain: true,
            xhrFields: {
               withCredentials: false
            }
         });

         rawRequests.push(rawDataRequest);

         rawDataRequest.done(function(rawFileContents) {
            rawData[i] = {
               filename: filename,
               htmlHref: thisFile.links.html.href,
               contents: rawFileContents
            };
         });
      });

      // Write out the contents of all of the files once you recieve them
      AJS.$.when.apply(AJS.$, rawRequests).done(function() {
         AJS.$("#content").append(templates.render('bitbucket-snippet-files', {
            files: rawData
         }));
         highlight.initHighlighting();

         allJs.done(function() {
            AP.resize();
         });
      });
   });
});
