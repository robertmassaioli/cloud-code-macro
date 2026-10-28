let default = https://prelude.dhall-lang.org/Optional/default

let map = https://prelude.dhall-lang.org/List/map

-- Titles and descriptions are translation keys, resolved from locales/<code>.json
let i18n = \(key : Text) -> { i18n = key }

-- The 26 locales Forge supports, https://developer.atlassian.com/platform/forge/manifest-reference/forge-supported-locale-codes/
-- Keep in step with SUPPORTED_LOCALES in static/app/src/i18n.js (a test checks this).
let localeCodes : List Text =
  [ "zh-CN", "zh-TW", "cs-CZ", "da-DK", "nl-NL", "en-US", "en-GB", "et-EE", "fi-FI", "fr-FR", "de-DE", "hu-HU", "is-IS"
  , "it-IT", "ja-JP", "ko-KR", "no-NO", "pl-PL", "pt-BR", "pt-PT", "ro-RO", "ru-RU", "sk-SK", "tr-TR", "es-ES", "sv-SE"
  ]

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
      , description = Some (i18n "macro.codeEditor.description")
      , resource = "app"
      , title = i18n "macro.codeEditor.title"
      , config = True
      , categories = Some [ "development", "formatting" ]
      , featured = Some False
      , bodied = Some False
      , hidden = None Bool
      , autoConvert = None { matchers : List { pattern : Text } }
      }
    , { key = "bitbucket-snippet-code-macro" ++ (default Text "" config.macroKeySuffix)
      , title = i18n "macro.bitbucketSnippet.title"
      , description = Some (i18n "macro.bitbucketSnippet.description")
      , resource = "app"
      , config = True
      , categories = Some [ "external-content", "development" ]
      , featured = Some False
      , bodied = Some False
      , hidden = Some True
      , autoConvert = None { matchers : List { pattern : Text } }
      }
    , { key = "gist-code-macro" ++ (default Text "" config.macroKeySuffix)
      , title = i18n "macro.gist.title"
      , description = Some (i18n "macro.gist.description")
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
      , title = i18n "macro.codeBlock.title"
      , description = Some (i18n "macro.codeBlock.description")
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
, translations =
  { fallback.default = "en-GB"
  , resources =
      map
        Text
        { key : Text, path : Text }
        (\(code : Text) -> { key = code, path = "locales/${code}.json" })
        localeCodes
  }
}
