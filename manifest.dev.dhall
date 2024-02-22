./manifest.dhall /\ {
  app.connect.key = "com.not-atlassian.connect.better-code-macro.prod.dev",
  remotes = [ { baseUrl = "https://cloud-code-macro.dev.services.atlassian.com", key = "connect" } ]
}