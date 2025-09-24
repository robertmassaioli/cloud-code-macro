let default = https://prelude.dhall-lang.org/Optional/default

let Config : Type =
  { connectKey: Text
  , baseUrl: Text
  , macroKeySuffix: Optional Text
  }
in \(config: Config) -> { app =
  { connect =
    { key = config.connectKey
    }
  , id = "ari:cloud:ecosystem::app/1f719b35-249b-4ec7-80c5-de810567f87c"
  , runtime.name = "nodejs20.x"
  }
, modules =
  { function =
    [ { handler = "index.handler"
      , key = "resolver"
      }
    ]
  , macro =
    [ { key = "in-page-editor" ++ (default Text "" config.macroKeySuffix)
      , description = Some "Add a code editor experience to your confluence page."
      , resource = "in-page-editor"
      , title = "Code Editor"
      , config = True
      , categories = Some [ "development", "formatting" ]
      , featured = Some False
      , bodied = Some False
      , autoConvert = None { matchers : List { pattern : Text } }
      }
    , { key = "bitbucket-snippet-code-macro" ++ (default Text "" config.macroKeySuffix)
      , title = "Bitbucket Snippet"
      , description = Some "DEPRECATED: Bitbucket Snippet macro is no longer supported due to technical limitations"
      , resource = "bitbucket-snippet"
      , config = True
      , categories = Some [ "external-content", "development" ]
      , featured = Some False
      , bodied = Some False
      , autoConvert = None { matchers : List { pattern : Text } }
      }
    , { key = "gist-code-macro" ++ (default Text "" config.macroKeySuffix)
      , title = "GitHub Gist"
      , description = Some "Display GitHub gists in Confluence"
      , resource = "gist-code-macro"
      , config = True
      , categories = Some [ "external-content", "development" ]
      , featured = Some False
      , bodied = Some False
      , autoConvert = Some
        { matchers =
          [ { pattern = "https://gist.github.com/*/*" }
          ]
        }
      }
    , { key = "paste-code-macro" ++ (default Text "" config.macroKeySuffix)
      , title = "Better Code Block"
      , description = Some "Better macro to format blocks of source code or markup."
      , resource = "paste-code-macro"
      , config = True
      , categories = Some [ "formatting", "development" ]
      , featured = Some True
      , bodied = Some True
      , autoConvert = None { matchers : List { pattern : Text } }
      }
    ]
  }
, permissions =
  { scopes = [ "read:connect-confluence", "read:page:confluence", "write:page:confluence" ]
  , content.styles = [ "unsafe-inline" ]
  , external =
    { scripts =
      [ { address = "cdn.jsdelivr.net", inScopeEUD = False }
      , { address = "gist.github.com", inScopeEUD = False }
      , { address = "bitbucket.org", inScopeEUD = False }
      ]
    , styles =
      [ { address = "cdn.jsdelivr.net", inScopeEUD = False }
      , { address = "github.githubassets.com", inScopeEUD = False }
      , { address = "cdnjs.cloudflare.com", inScopeEUD = False }
      ]
    , fetch =
      { client =
        [ { address = "api.bitbucket.org", inScopeEUD = False }
        , { address = "bitbucket.org", inScopeEUD = False }
        ]
      }
    }
  }
, resources =
  [ { key = "in-page-editor", path = "static/in-page-editor/build", tunnel.port = 3001 }
  , { key = "bitbucket-snippet", path = "static/bitbucket-snippet/build", tunnel.port = 3002 }
  , { key = "gist-code-macro", path = "static/gist-code-macro/build", tunnel.port = 3003 }
  , { key = "paste-code-macro", path = "static/paste-code-macro/build", tunnel.port = 3004 }
  ]
}
