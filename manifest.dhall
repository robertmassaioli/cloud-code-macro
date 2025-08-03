let default = https://prelude.dhall-lang.org/Optional/default

let Config : Type =
  { connectKey: Text
  , baseUrl: Text
  , macroKeySuffix: Optional Text
  }
in \(config: Config) -> { app =
  { connect =
    { remote = "connect"
    , key = config.connectKey
    }
  , id = "ari:cloud:ecosystem::app/1f719b35-249b-4ec7-80c5-de810567f87c"
  , runtime.name = "nodejs18.x"
  , features.autoUserConsent = True
  }
, connectModules.`confluence:dynamicContentMacros`
  =
  [ { aliases = [ "snippet", "bbsnippet", "bitbucket" ]
    , autoconvert = Some
      { matchers =
        [ { pattern = "https://bitbucket.org/snippets/{}/{}" }
        , { pattern = "https://bitbucket.org/snippets/{}/{}/{}" }
        ]
      , urlParameter = "snippetUrl"
      }
    , bodyType = "none"
    , categories = [ "development", "external-content" ]
    , description = None { value : Text }
    , documentation.url = "/docs/bitbucket-snippets"
    , featured = False
    , hidden = Some True
    , icon =
      { height = 80
      , url = "/static/images/bitbucket/bitbucket-logo-80px.png"
      , width = 80
      }
    , key = "bitbucket-snippet-code-macro" ++ (default Text "" config.macroKeySuffix)
    , name.value = "Bitbucket snippet macro"
    , outputType = "block"
    , parameters =
      [ { defaultValue = None Text
        , description = None { value : Text }
        , hidden = Some True
        , identifier = "snippetUrl"
        , multiple = Some False
        , name.value = "Snippet url"
        , required = True
        , type = "string"
        , values = None (List Text)
        }
      ]
    , url = "/macro/bitbucket-snippet-code-macro?snippetUrl={snippetUrl}"
    }
  ]
, modules =
  { function =
    [ { handler = "index.handler"
      , key = "resolver"
      }
    ]
  , macro =
    [ { description = "Add a code editor experience to your confluence page."
      , key = "in-page-editor" ++ (default Text "" config.macroKeySuffix)
      , resource = "main"
      , title = "Code Editor"
      , config = True
      , categories = Some [ "development", "formatting" ]
      , featured = Some False
      , autoconvert = None { matchers : List { pattern : Text } }
      }
    , { key = "bitbucket-snippet-forge-macro"
      , title = "Bitbucket Snippet (Forge)"
      , description = "Display Bitbucket code snippets in Confluence"
      , resource = "bitbucket-snippet"
      , config = True
      , categories = Some [ "external-content", "development" ]
      , featured = Some False
      , autoconvert = Some
        { matchers =
          [ { pattern = "https://bitbucket.org/snippets/*/*" }
          , { pattern = "https://bitbucket.org/snippets/*/*/*" }
          , { pattern = "https://bitbucket.org/*/workspace/snippets/*/*" }
          ]
        }
      }
    , { key = "gist-code-forge-macro"
      , title = "GitHub Gist (Forge)"
      , description = "Display GitHub gists in Confluence"
      , resource = "gist-code-macro"
      , config = True
      , categories = Some [ "external-content", "development" ]
      , featured = Some False
      , autoconvert = Some
        { matchers =
          [ { pattern = "https://gist.github.com/*/*" }
          ]
        }
      }
    , { key = "paste-code-forge-macro"
      , title = "Better Code Block (Forge)"
      , description = Some "Better macro to format blocks of source code or markup."
      , resource = "paste-code-macro"
      , config = True
      , categories = Some [ "formatting", "development" ]
      , featured = Some True
      , autoconvert = None { matchers : List { pattern : Text } }
      }
    ]
  }
, permissions =
  { scopes = [ "read:connect-confluence", "read:page:confluence", "write:page:confluence" ]
  , content.styles = [ "unsafe-inline" ]
  , external =
    { scripts = [ "cdn.jsdelivr.net" ]
    , styles = [ "cdn.jsdelivr.net" ]
    }
  }
, resources =
  [ { key = "main", path = "static/hello-world/build", tunnel.port = 3001 }
  , { key = "bitbucket-snippet", path = "static/bitbucket-snippet/build", tunnel.port = 3002 }
  , { key = "gist-code-macro", path = "static/gist-code-macro/build", tunnel.port = 3003 }
  , { key = "paste-code-macro", path = "static/paste-code-macro/build", tunnel.port = 3004 }
  ]
, remotes = [ { baseUrl = config.baseUrl, key = "connect" } ]
}
