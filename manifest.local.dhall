./manifest.dhall /\ {
  app.connect.key = "com.not-atlassian.connect.better-code-macro.prod.local",
  remotes = [ { baseUrl = "https://rmassaioli.public.atlastunnel.com", key = "connect" } ]
}