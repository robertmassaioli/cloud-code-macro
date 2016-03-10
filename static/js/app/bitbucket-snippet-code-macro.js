define(['../helpers/PageContext', '../helpers/MustacheLoader', '../lib/highlight', '../lib/URI', 'underscore'], function(PC, ML, highlight, URI, _) {
   var pageContext = PC.load();
   var templates = ML.load();

   var rawSnippetUrl = AJS.$("meta[name='snippet-url']").attr('content');
   var snippetUrl = URI(rawSnippetUrl);
   console.log("Snippet url: " + snippetUrl);

   var apiUrl = snippetUrl.segmentCoded([
      '!api',
      '2.0',
      snippetUrl.segmentCoded(0),
      snippetUrl.segmentCoded(1),
      snippetUrl.segmentCoded(2)
   ]);
   console.log("Api url: " + apiUrl);

   var apiRequest = AJS.$.ajax({
      url: apiUrl,
      type: 'GET',
      cache: false,
      dataType: 'json',
      crossDomain: true,
      xhrFields: {
         withCredentials: false
      }
   });

   var allJs = $.getScript(pageContext.productBaseUrl + '/atlassian-connect/all.js');

   apiRequest.done(function(data) {
      console.log(data);
      // TODO for each of the files download the raw content and setup a highlightjs block
      var rawRequests = [];
      var rawData = [];
      AJS.$.each(_.allKeys(data.files), function(i, filename) {
         console.log(data.files[filename]);
         var thisFile = data.files[filename];
         var rawDataRequest = AJS.$.ajax({
            url: thisFile.links.self.href,
            type: 'GET',
            cache: false,
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

      AJS.$.when.apply(AJS.$, rawRequests).done(function() {
         console.log(rawData);
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
