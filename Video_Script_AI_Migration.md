# Video Script: "How I Used AI to Migrate from Atlassian Connect to Forge"

## Video Overview
**Duration**: 15-20 minutes  
**Target Audience**: Developers, CTOs, Engineering Managers  
**Tone**: Technical but accessible, demonstrating practical AI application

---

## 🎬 **INTRO** (0:00 - 1:30)

**[On Screen: Title slide + your intro]**

**You**: "Hey everyone! Today I want to share something pretty incredible that happened over the last few weeks. I used AI to completely migrate our Atlassian Connect app to the modern Forge platform, and the results blew my mind.

We're talking about 75 commits, over 60,000 lines of code changes, multiple React applications built from scratch, and going from 7 security vulnerabilities to zero. All with AI as my pair programming partner.

But here's the kicker - this would have taken an experienced developer 6-10 weeks to do manually. We did it in a fraction of that time, and I learned things about both platforms that I never would have discovered on my own.

So let's dive into how AI became my platform migration specialist."

---

## 📊 **THE CHALLENGE** (1:30 - 3:00)

**[On Screen: Before/After architecture diagram]**

**You**: "First, let me set the stage. We had a mature Atlassian Connect app called 'Better Code Macro' that thousands of Confluence users rely on. It had three main features - a paste code macro, GitHub Gist integration, and Bitbucket snippet support.

But Connect is legacy technology. Forge is Atlassian's modern platform with better security, performance, and user experience. The problem? These are completely different architectures.

**[Show complexity on screen]**

Connect uses server-side rendering with Express.js and Mustache templates. Forge uses React-based CustomUI with a completely different permission model, build system, and deployment process.

Oh, and we needed zero downtime - existing users couldn't lose functionality during the migration.

This is exactly the kind of complex, multi-layered challenge where AI really shines."

---

## 🧠 **AI AS PLATFORM EXPERT** (3:00 - 5:30)

**[On Screen: Code commits showing the migration]**

**You**: "Here's where it gets interesting. I started by asking AI to analyze our Connect manifest and plan a migration strategy. Within minutes, it had identified the key challenge: maintaining backward compatibility while modernizing the architecture.

The AI suggested a hybrid approach - keep the Connect backend for existing functionality while building new Forge macros with the same module keys. This was brilliant because it meant zero breaking changes for users.

**[Show the key commit]**

Look at this commit: 'Complete Connect to Forge migration while preserving module keys.' This single change migrated all our dynamic content macros to Forge modules while maintaining the exact same identifiers. 

An experienced developer would need deep knowledge of both platforms to pull this off safely. The AI not only knew both architectures but understood the business requirement for backward compatibility."

---

## ⚡ **CUSTOMUI TRANSFORMATION** (5:30 - 8:00)

**[On Screen: Show the four new React applications]**

**You**: "But the real magic happened with the CustomUI components. We needed to build four separate React applications from scratch - and I mean completely from scratch.

**[Screen recording of the file structure]**

Each one needed:
- Complete webpack configuration
- React setup with Forge UI Kit integration  
- Theme management systems
- Build pipelines
- CSP compliance for security

Watch this - in a single session, AI generated production-ready boilerplate for all four components. But it wasn't just copy-paste code. It understood our requirements and built each component with the specific features it needed.

**[Show specific code examples]**

The paste code macro got a sophisticated theme system with 70+ verified highlight.js themes. The Gist macro got URL parsing and GitHub API integration. Each one was tailored for its specific use case.

Manually, this would have been weeks of React development work. With AI, we had working prototypes in hours."

---

## 🔒 **SECURITY & MODERNIZATION** (8:00 - 10:00)

**[On Screen: Security audit before/after]**

**You**: "One of my favorite parts of this project was watching AI tackle our security issues. We started with 7 vulnerabilities ranging from moderate to critical.

**[Show the security audit]**

AI didn't just patch them - it completely modernized our stack. It upgraded us from Express 4.18 to 5.1.0, replaced a vulnerable template library called 'mustang' with the secure 'mustache' alternative, and eliminated 75 vulnerable dependency packages.

But here's what impressed me most - it maintained 100% functional compatibility while doing this. All our existing APIs, endpoints, and features kept working exactly the same.

**[Show the code changes]**

Look at this transformation - modern ES6+ syntax, async/await patterns, proper error handling. AI didn't just fix problems, it modernized our entire codebase to current best practices."

---

## 🏗️ **CI/CD PIPELINE MASTERY** (10:00 - 12:00)

**[On Screen: Pipeline configuration and build results]**

**You**: "The CI/CD transformation was mind-blowing. Our old pipeline was a single build process that often failed with cryptic dependency conflicts.

AI redesigned it as four parallel build pipelines, each handling a different component in isolation. It added Node 22 support, implemented Atlassian's artifactory integration, and created sophisticated dependency management.

**[Show the pipeline running]**

But the real genius was in the problem-solving. When builds failed due to React version conflicts, AI didn't just add workarounds - it architected a solution using isolated environments and legacy peer dependency handling.

When we hit Atlassian package registry authentication issues, AI immediately knew to use their official artifactory-sidekick tool. This kind of platform-specific knowledge would take developers weeks to research and implement."

---

## 🎨 **THEME SYSTEM ENGINEERING** (12:00 - 14:00)

**[On Screen: Theme system in action]**

**You**: "Here's a perfect example of AI's research capabilities. Our users wanted a comprehensive theme system for code highlighting.

**[Show the theme mapping code]**

AI researched 70+ highlight.js themes, verified each CDN URL actually worked, created human-readable mappings, and built a dynamic loading system that handles CSP security policies.

**[Switch to dark mode demonstration]**

But the real breakthrough was the dark mode implementation. Watch this - when I switch to a dark theme like 'GitHub Dark' or 'Tokyo Night', the entire code block seamlessly transitions. The background, borders, everything matches perfectly.

**[Show the CSS inheritance code]**

AI figured out that both the `<pre>` container and `<code>` element needed the `hljs` class for proper theme inheritance. It solved complex CSS specificity issues where our inline styles were overriding the theme CSS.

**[Demonstrate theme switching]**

It even discovered that some theme names didn't match the actual CDN file names and built a translation layer. Plus, it implemented intelligent background matching - dark themes get dark containers, light themes get light containers, all automatically.

This level of detail and verification - plus the advanced dark mode CSS debugging - would have taken days of manual research and testing."

---

## 📈 **RESULTS & IMPACT** (14:00 - 15:30)

**[On Screen: Metrics and results]**

**You**: "Let's talk results. In total, AI helped produce:
- 75 commits across the migration
- 63,767 lines of code added, 35,295 removed
- Four production-ready React applications
- Zero security vulnerabilities
- 100% backward compatibility
- Modern CI/CD pipelines

**[Show deployment success]**

But the real metric is time. Conservative estimate: this would have taken an experienced full-stack developer 6-10 weeks. We completed it in development sessions spanning days.

More importantly, the quality is exceptional. AI didn't just make it work - it implemented best practices, modern patterns, and enterprise-grade architecture.

**[Show the running application]**

The end result is a hybrid Connect/Forge app that gives users the best of both worlds - proven stability with modern capabilities."

---

## 💡 **KEY TAKEAWAYS** (15:30 - 17:00)

**[On Screen: Key lessons learned]**

**You**: "So what did I learn about AI as a development partner?

**First** - AI excels at cross-platform expertise. It understood both Connect and Forge deeply, something that would take developers months to master.

**Second** - AI is incredible at research-intensive tasks. Finding secure alternatives, verifying URLs, mapping dependencies - this stuff that usually involves hours of documentation diving.

**Third** - AI maintains context across massive refactors. It kept track of business requirements, technical constraints, and user impact across 75 commits.

**But** - and this is important - AI amplifies human decision-making, it doesn't replace it. I still made all the strategic decisions about what to build and when to deploy."

---

## 🚀 **FUTURE IMPLICATIONS** (17:00 - 18:30)

**[On Screen: Future possibilities]**

**You**: "This migration opened my eyes to what's possible with AI-assisted development. We're not talking about simple code completion anymore.

AI can now serve as a platform migration specialist, security researcher, build system architect, and full-stack developer all in one.

For engineering teams, this means:
- Faster platform migrations with less risk
- Automated security improvements 
- Adoption of modern practices without the usual learning curve
- The ability to tackle projects that would normally require multiple specialists

The question isn't whether AI will change how we develop software - it's how quickly we can adapt to leverage these capabilities."

---

## 🎯 **CALL TO ACTION** (18:30 - 19:30)

**[On Screen: Resources and next steps]**

**You**: "If you're dealing with legacy platform migrations, security debt, or complex modernization projects, I highly recommend experimenting with AI as your development partner.

I've put together a detailed analysis of this migration with all the commits, metrics, and lessons learned - link is in the description.

And if you want to see the actual code, the Better Code Macro for Confluence is open source. You can see exactly how we built this hybrid architecture.

What platform migrations are you facing? What would you tackle with AI as your pair programming partner? Let me know in the comments - I'd love to hear about your experiences.

Thanks for watching, and happy coding!"

---

## 📝 **END SCREEN SUGGESTIONS**

**[On Screen: Subscribe + Related Videos]**

- Link to detailed analysis (AI_Migration_Analysis.md)
- Link to GitHub repository
- Related videos on AI-assisted development
- Subscribe for more technical deep-dives

---

## 🎥 **PRODUCTION NOTES**

### Visual Elements Needed:
1. **Architecture diagrams** - Before/after Connect vs Forge
2. **Code screenshots** - Key commits and changes
3. **Security audit results** - Before/after vulnerability scans
4. **Pipeline demos** - CI/CD builds running successfully
5. **Theme system demo** - Live switching between themes
6. **Metrics visualization** - 75 commits, 60k+ lines changed

### Screen Recording Segments:
1. Git log showing the 75 commits
2. File structure of the four React applications
3. Security audit before/after comparison
4. CI/CD pipeline running in parallel
5. Theme system working with dark mode transitions in the deployed app
6. Before/after comparison of theme inheritance and CSS conflicts
7. Performance comparison Connect vs Forge

### Key Message Reinforcement:
- Emphasize **practical business value** over technical novelty
- Show **real metrics** and concrete results
- Demonstrate **quality and maintainability** of AI-generated code
- Highlight **time savings** and **risk reduction**
- Position AI as **amplifying human expertise**, not replacing it