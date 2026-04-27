# Architecture Before Migration

```mermaid
graph TB
    subgraph "Atlassian Connect App"
        subgraph "Connect Backend (Node.js)"
            Express["Express 4.18.2<br/>7 Security Vulnerabilities"]
            Mustang["Mustang Template Engine<br/>(Vulnerable Dependencies)"]
            ConnectRoutes["Connect Routes<br/>/atlassian-connect.json<br/>/macro/*"]
            StaticAssets["Static Assets<br/>Grunt Build System"]
        end
        
        subgraph "Connect Manifest"
            ConnectMacros["Dynamic Content Macros<br/>• bitbucket-snippet-code-macro<br/>• gist-code-macro<br/>• paste-code-macro"]
            ConnectScopes["Connect Scopes<br/>• read:connect-confluence<br/>• read:page:confluence<br/>• write:page:confluence"]
            ConnectAuth["Authentication: none<br/>Server-side rendering"]
        end
        
        subgraph "Static Resources"
            JS["JavaScript (RequireJS)<br/>• Bundled with Grunt<br/>• Legacy dependencies"]
            CSS["CSS (LESS)<br/>• Compiled with Grunt<br/>• Single theme system"]
            Images["Static Images<br/>• GitHub/Bitbucket icons"]
        end
    end
    
    subgraph "User Experience"
        ConnectUI["Server-Rendered UI<br/>• Mustache templates<br/>• Limited interactivity<br/>• Basic theme support"]
        ConnectFeatures["Features<br/>• Paste code blocks<br/>• GitHub Gist embedding<br/>• Bitbucket snippets<br/>• Fixed theme selection"]
    end
    
    subgraph "CI/CD Pipeline"
        SingleBuild["Single Build Process<br/>• Node 18<br/>• Sequential operations<br/>• Grunt-based<br/>• Frequent conflicts"]
        Vulnerabilities["Security Issues<br/>• 7 vulnerabilities<br/>• Vulnerable mustang deps<br/>• Outdated packages"]
    end
    
    subgraph "External Dependencies"
        OldExpress["Express 4.x<br/>(Older patterns)"]
        VulnerableDeps["Vulnerable Dependencies<br/>• mustang<br/>• mongodb (unused)<br/>• request (deprecated)<br/>• tough-cookie issues"]
        LimitedCDN["Limited CDN Access<br/>• Basic theme support<br/>• Hardcoded theme list"]
    end

    Express --> ConnectRoutes
    ConnectRoutes --> ConnectMacros
    Mustang --> ConnectUI
    StaticAssets --> JS
    StaticAssets --> CSS
    SingleBuild --> Vulnerabilities
    ConnectMacros --> ConnectFeatures
    OldExpress --> Express
    VulnerableDeps --> Mustang
    LimitedCDN --> CSS
    
    classDef vulnerable fill:#ffcccc,stroke:#ff6666,stroke-width:2px
    classDef legacy fill:#fff3cd,stroke:#ffc107,stroke-width:2px
    classDef limited fill:#f8d7da,stroke:#dc3545,stroke-width:2px
    
    class Express,Mustang,VulnerableDeps vulnerable
    class JS,CSS,SingleBuild,OldExpress legacy
    class ConnectAuth,LimitedCDN limited
```

## Key Characteristics (Before)

### **Architecture Pattern**
- **Monolithic Connect App**: Single Express.js server handling all functionality
- **Server-Side Rendering**: Mustache templates with limited client-side interaction
- **Static Asset Pipeline**: Grunt-based build system for CSS/JS bundling

### **Security Posture**
- **7 Active Vulnerabilities**: Critical and high-severity security issues
- **Vulnerable Dependencies**: mustang, mongodb, request, tough-cookie
- **Outdated Framework**: Express 4.18.2 with legacy patterns

### **User Experience**
- **Basic Theme Support**: Limited theme selection with hardcoded options
- **Server-Rendered UI**: Limited interactivity and slower response times
- **Fixed Feature Set**: Static macro functionality without customization

### **Development Experience**
- **Single Build Pipeline**: Sequential operations prone to conflicts
- **Dependency Management**: Complex security overrides and workarounds
- **Platform Lock-in**: Pure Connect architecture with no migration path