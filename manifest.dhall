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
  , runtime.name = "nodejs22.x"
  }
, modules =
  { function =
    [ { handler = "index.handler"
      , key = "resolver"
      }
    ]
  , macro =
    [ { key = "in-page-editor" ++ (default Text "" config.macroKeySuffix)
      , description = Some "Edit code within your Confluence page"
      , resource = "app"
      , title = "Code editor"
      , config = True
      , categories = Some [ "development", "formatting" ]
      , featured = Some False
      , bodied = Some False
      , hidden = None Bool
      , autoConvert = None { matchers : List { pattern : Text } }
      }
    , { key = "bitbucket-snippet-code-macro" ++ (default Text "" config.macroKeySuffix)
      , title = "Bitbucket Snippet"
      , description = Some "DEPRECATED: Bitbucket Snippet macro is no longer supported due to technical limitations"
      , resource = "app"
      , config = True
      , categories = Some [ "external-content", "development" ]
      , featured = Some False
      , bodied = Some False
      , hidden = Some True
      , autoConvert = None { matchers : List { pattern : Text } }
      }
    , { key = "gist-code-macro" ++ (default Text "" config.macroKeySuffix)
      , title = "GitHub Gist"
      , description = Some "Display GitHub gists in Confluence"
      , resource = "app"
      , config = True
      , categories = Some [ "external-content", "development" ]
      , featured = Some False
      , bodied = Some False
      , hidden = None Bool
      , autoConvert = Some
        { matchers =
          [ { pattern = "https://gist.github.com/*/*" }
          ]
        }
      }
    , { key = "paste-code-macro" ++ (default Text "" config.macroKeySuffix)
      , title = "Better code block"
      , description = Some "Format blocks of source code or markup"
      , resource = "app"
      , config = True
      , categories = Some [ "formatting", "development" ]
      , featured = Some True
      , bodied = Some True
      , hidden = None Bool
      , autoConvert = None { matchers : List { pattern : Text } }
      }
    ]
  }
, permissions =
  { scopes = [ "read:page:confluence", "write:page:confluence" ]
  , content.styles = [ "unsafe-inline" ]
  , external =
    { scripts =
      [ { address = "cdn.jsdelivr.net", inScopeEUD = False }
      , { address = "gist.github.com", inScopeEUD = False }
      ]
    , styles =
      [ { address = "cdn.jsdelivr.net", inScopeEUD = False }
      , { address = "github.githubassets.com", inScopeEUD = False }
      , { address = "cdnjs.cloudflare.com", inScopeEUD = False }
      ]
    }
  }
, resources =
  [ { key = "app", path = "static/app/build", tunnel.port = 3001 }
  ]
-- SPIKE (proposal 003, step 1): minimal locales to test translation loading. Replace with all 26 in step 6.
, translations =
  { default = "en-GB"
  , resources =
    [ { key = "en-GB", path = "locales/en-GB.json" }
    , { key = "fr-FR", path = "locales/fr-FR.json" }
    , { key = "de-DE", path = "locales/de-DE.json" }
    , { key = "ja-JP", path = "locales/ja-JP.json" }
    ]
  }
}
