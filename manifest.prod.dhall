./manifest.dhall /\ {
  app.connect.key = "com.not-atlassian.connect.better-code-macro.prod",
  remotes = [ { baseUrl = "https://cloud-code-macro.services.atlassian.com", key = "connect" } ]
}