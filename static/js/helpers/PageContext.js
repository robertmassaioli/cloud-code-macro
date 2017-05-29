define(["../lib/URI"], function(URI) {
    // If you put the context variables in well named locations then this will parse them out for you
    var loadPageContext = function() {
        var queryParams = URI(window.location.href).query(true);

        var pageContext = {};

        // Getting the avaliable context params from here: https://developer.atlassian.com/static/connect/docs/concepts/context-parameters.html

        pageContext.user = {
            id: queryParams["user_id"],
            key: queryParams["user_key"]
        };

        // JIRA Page Context Items
        pageContext.project = {
            id: parseInt(queryParams["project_id"]),
            key: queryParams["project_key"]
        };
        pageContext.issue = {
            id: parseInt(queryParams["issue_id"]),
            key: queryParams["issue_key"]
        };
        pageContext.version = {
            id: parseInt(queryParams["version_id"])
        };
        pageContext.component = {
            id: parseInt(queryParams["component_id"])
        };
        pageContext.profileUser = {
            key: queryParams["profile_user_key"],
            name: queryParams["profile_user_name"]
        };

        // Confluence Page Context Items
        pageContext.macro = {
           id: queryParams["macro_id"],
           body: queryParams["macro_body"],
           truncated: queryParams["macro_truncated"],
           theme: queryParams["theme"],
           language: queryParams["language"]
        };
        pageContext.page = {
           id: parseInt(queryParams["page_id"]),
           title: queryParams["page_title"],
           type: queryParams["page_type"],
           version: parseInt(queryParams["page_version"])
        };
        pageContext.space = {
           id: parseInt(queryParams["space_id"]),
           key: queryParams["space_key"]
        };
        pageContext.output = {
           type: queryParams["output_type"]
        };

        pageContext.productBaseUrl = queryParams['xdm_e'] + queryParams['cp']; 

        return pageContext;
    };

    return {
        load: loadPageContext
    };
});
