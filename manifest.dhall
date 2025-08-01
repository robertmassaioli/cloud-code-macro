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
  , { aliases = [ "gist" ]
    , autoconvert = Some
      { matchers = [ { pattern = "https://gist.github.com/{}/{}" } ]
      , urlParameter = "gistUrl"
      }
    , bodyType = "none"
    , categories = [ "development", "external-content" ]
    , description = None { value : Text }
    , documentation.url = "/docs/gist-code-macro"
    , featured = False
    , hidden = Some True
    , icon =
      { height = 80
      , url = "/static/images/github/GitHub-Mark-80px.png"
      , width = 80
      }
    , key = "gist-code-macro" ++ (default Text "" config.macroKeySuffix)
    , name.value = "GitHub gist macro"
    , outputType = "block"
    , parameters =
      [ { defaultValue = None Text
        , description = None { value : Text }
        , hidden = Some True
        , identifier = "gistUrl"
        , multiple = Some False
        , name.value = "Gist url"
        , required = True
        , type = "string"
        , values = None (List Text)
        }
      ]
    , url = "/macro/gist-code-macro?gistUrl={gistUrl}"
    }
  , { aliases = [ "bettercode", "codebetter", "bcode" ]
    , autoconvert =
        None { matchers : List { pattern : Text }, urlParameter : Text }
    , bodyType = "plain-text"
    , categories = [ "development", "formatting" ]
    , description = Some
      { value = "Better macro to format blocks of source code or markup." }
    , documentation.url = "/docs/paste-code-macro"
    , featured = True
    , hidden = None Bool
    , icon =
      { height = 80
      , url = "/static/images/cloud-code-macro-paste-icon.png"
      , width = 80
      }
    , key = "paste-code-macro" ++ (default Text "" config.macroKeySuffix)
    , name.value = "Better Code Block"
    , outputType = "block"
    , parameters =
      [ { defaultValue = None Text
        , description = Some
          { value =
              "Choose the programming / markup language for your code explicitly."
          }
        , hidden = Some False
        , identifier = "language"
        , multiple = None Bool
        , name.value = "Language"
        , required = False
        , type = "enum"
        , values = Some
          [ "1c"
          , "accesslog"
          , "actionscript"
          , "apache"
          , "applescript"
          , "arduino"
          , "armasm"
          , "asciidoc"
          , "aspectj"
          , "autohotkey"
          , "autoit"
          , "avrasm"
          , "axapta"
          , "bash"
          , "basic"
          , "brainfuck"
          , "cal"
          , "capnproto"
          , "ceylon"
          , "clojure-repl"
          , "clojure"
          , "cmake"
          , "coffeescript"
          , "cos"
          , "cpp"
          , "crmsh"
          , "crystal"
          , "cs"
          , "csp"
          , "css"
          , "d"
          , "dart"
          , "delphi"
          , "diff"
          , "django"
          , "dns"
          , "dockerfile"
          , "dos"
          , "dts"
          , "dust"
          , "elixir"
          , "elm"
          , "erb"
          , "erlang-repl"
          , "erlang"
          , "fix"
          , "fortran"
          , "fsharp"
          , "gams"
          , "gauss"
          , "gcode"
          , "gherkin"
          , "glsl"
          , "go"
          , "golo"
          , "gradle"
          , "groovy"
          , "haml"
          , "handlebars"
          , "haskell"
          , "haxe"
          , "hsp"
          , "htmlbars"
          , "http"
          , "inform7"
          , "ini"
          , "irpf90"
          , "java"
          , "javascript"
          , "json"
          , "julia"
          , "kotlin"
          , "lasso"
          , "less"
          , "lisp"
          , "livecodeserver"
          , "livescript"
          , "lua"
          , "makefile"
          , "markdown"
          , "mathematica"
          , "matlab"
          , "maxima"
          , "mel"
          , "mercury"
          , "mipsasm"
          , "mizar"
          , "mojolicious"
          , "monkey"
          , "nginx"
          , "nimrod"
          , "nix"
          , "nsis"
          , "objectivec"
          , "ocaml"
          , "openscad"
          , "oxygene"
          , "parser3"
          , "perl"
          , "pf"
          , "php"
          , "powershell"
          , "processing"
          , "profile"
          , "prolog"
          , "protobuf"
          , "puppet"
          , "python"
          , "q"
          , "qml"
          , "r"
          , "rib"
          , "roboconf"
          , "rsl"
          , "ruby"
          , "ruleslanguage"
          , "rust"
          , "scala"
          , "scheme"
          , "scilab"
          , "scss"
          , "smali"
          , "smalltalk"
          , "sml"
          , "sqf"
          , "sql"
          , "stan"
          , "stata"
          , "step21"
          , "stylus"
          , "swift"
          , "taggerscript"
          , "tcl"
          , "tex"
          , "thrift"
          , "tp"
          , "twig"
          , "typescript"
          , "vala"
          , "vbnet"
          , "vbscript-html"
          , "vbscript"
          , "verilog"
          , "vhdl"
          , "vim"
          , "x86asm"
          , "xl"
          , "xml"
          , "xquery"
          , "yaml"
          , "zephir"
          ]
        }
      , { defaultValue = None Text
        , description = Some
          { value = "An optional title for your code black." }
        , hidden = None Bool
        , identifier = "title"
        , multiple = None Bool
        , name.value = "Title"
        , required = False
        , type = "string"
        , values = None (List Text)
        }
      , { defaultValue = Some "Github Gist"
        , description = Some { value = "Choose the theme for your code." }
        , hidden = None Bool
        , identifier = "theme"
        , multiple = None Bool
        , name.value = "Theme"
        , required = False
        , type = "enum"
        , values = Some
          [ "Agate"
          , "Androidstudio"
          , "Arduino Light"
          , "Arta"
          , "Ascetic"
          , "Atelier Cave Dark"
          , "Atelier Cave Light"
          , "Atelier Dune Dark"
          , "Atelier Dune Light"
          , "Atelier Estuary Dark"
          , "Atelier Estuary Light"
          , "Atelier Forest Dark"
          , "Atelier Forest Light"
          , "Atelier Heath Dark"
          , "Atelier Heath Light"
          , "Atelier Lakeside Dark"
          , "Atelier Lakeside Light"
          , "Atelier Plateau Dark"
          , "Atelier Plateau Light"
          , "Atelier Savanna Dark"
          , "Atelier Savanna Light"
          , "Atelier Seaside Dark"
          , "Atelier Seaside Light"
          , "Atelier Sulphurpool Dark"
          , "Atelier Sulphurpool Light"
          , "Brown Paper"
          , "Codepen Embed"
          , "Color Brewer"
          , "Dark"
          , "Darkula"
          , "Default"
          , "Docco"
          , "Dracula"
          , "Far"
          , "Foundation"
          , "Github Gist"
          , "Github"
          , "Googlecode"
          , "Grayscale"
          , "Gruvbox Dark"
          , "Gruvbox Light"
          , "Hopscotch"
          , "Hybrid"
          , "Idea"
          , "Ir Black"
          , "Kimbie.dark"
          , "Kimbie.light"
          , "Magula"
          , "Mono Blue"
          , "Monokai Sublime"
          , "Monokai"
          , "Obsidian"
          , "Paraiso Dark"
          , "Paraiso Light"
          , "Pojoaque"
          , "Qtcreator_dark"
          , "Qtcreator_light"
          , "Railscasts"
          , "Rainbow"
          , "School Book"
          , "Solarized Dark"
          , "Solarized Light"
          , "Sunburst"
          , "Tomorrow Night Blue"
          , "Tomorrow Night Bright"
          , "Tomorrow Night Eighties"
          , "Tomorrow Night"
          , "Tomorrow"
          , "Vs"
          , "Xcode"
          , "Zenburn"
          ]
        }
      ]
    , url =
        "/macro/paste-code-macro?page_id={page.id}&macro_id={macro.id}&page_version={page.version}&output_type={output.type}&theme={theme}&language={language}&title={title}"
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
      , autoconvert = None { matchers : List { pattern : Text } }
      }
    , { key = "bitbucket-snippet-forge-macro"
      , title = "Bitbucket Snippet (Forge)"
      , description = "Display Bitbucket code snippets in Confluence"
      , resource = "bitbucket-snippet"
      , config = True
      , autoconvert = Some
        { matchers =
          [ { pattern = "https://bitbucket.org/snippets/*/*" }
          , { pattern = "https://bitbucket.org/snippets/*/*/*" }
          , { pattern = "https://bitbucket.org/*/workspace/snippets/*/*" }
          ]
        }
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
  ]
, remotes = [ { baseUrl = config.baseUrl, key = "connect" } ]
}
