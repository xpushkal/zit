# Product Requirements Document: zit

**Version:** 2.0

**Last Updated:** March 25, 2026

---

## Executive Summary

**zit** is an AI-powered, terminal-based Git and GitHub CLI tool that transforms Git from a command-memorization challenge into an intuitive, visual learning experience. By combining a rich TUI (Terminal User Interface) with intelligent AI mentorship, zit helps developers—especially beginners—learn Git faster, work more safely, and build confidence through guided workflows and real-time explanations.

### Vision

Make Git accessible and understandable for every developer by replacing error-prone commands with safe, visual workflows that teach as they work.

### Mission

Empower developers to master Git through an intelligent terminal interface that prevents mistakes, explains concepts in plain English, and builds intuition about version control.

---

## Problem Statement

### Current Pain Points

1. **Steep Learning Curve** : Git's complex command syntax and abstract concepts (HEAD, detached HEAD, rebase, cherry-pick) overwhelm beginners
2. **Fear of Mistakes** : Developers avoid powerful Git features due to fear of losing work or breaking history
3. **Cryptic Error Messages** : Git errors are technical and rarely explain what went wrong or how to fix it
4. **Hash-Based Navigation** : Navigating history via SHA hashes is unintuitive and error-prone
5. **Context Switching** : Developers leave the terminal to use GUI tools or search StackOverflow for help
6. **Lack of Guidance** : Git doesn't recommend safe vs. risky operations or explain trade-offs

### Target Users

* **Primary** : Junior developers (0-2 years experience) learning Git fundamentals
* **Secondary** : Intermediate developers (2-5 years) wanting to master advanced features safely
* **Tertiary** : Senior developers seeking productivity gains and reduced cognitive load

---

## Product Overview

### Core Philosophy

**"Terminal-Native Learning Assistant"**

zit is not just a Git UI wrapper—it's a learning tool that:

* Shows the current state visually
* Explains what's happening in plain English
* Guides users toward safe, best-practice workflows
* Provides guardrails without removing power
* Teaches Git concepts through use, not documentation

### Key Differentiators

1. **AI Mentor Integration** : Context-aware AI explains repo state, errors, and recommends actions
2. **Opinionated Safety** : Defaults to non-destructive operations with clear warnings for risky actions
3. **Visual Timeline Navigation** : Browse history by message/time/branch instead of hashes
4. **Terminal-Native** : No context switching; everything happens in the terminal developers already use
5. **Shell-Based Truth** : Uses actual Git commands as source of truth, not reimplementation

---

## Core Features

### 1. Repository Dashboard

 **User Story** : As a developer, I want to see my repository's current state at a glance so I can understand where I am and what needs attention.

 **Requirements** :

* Display current branch, commit status, and working tree state
* Show staged vs. unstaged changes with file counts
* Indicate ahead/behind status relative to remote
* Display recent commit summary (last 5 commits)
* Show stash count if present
* Visual indicators for clean/dirty state, conflicts, detached HEAD

 **Acceptance Criteria** :

* Dashboard loads in <500ms for typical repos
* All information is accurate and reflects current Git state
* Visual hierarchy clearly distinguishes critical info from context
* Refreshes automatically when repo state changes

---

### 2. Smart Staging (Interactive)

 **User Story** : As a developer, I want to stage changes visually and selectively so I can create focused, logical commits.

 **Requirements** :

* Display all modified/new/deleted files in a scrollable list
* Show diff preview for selected files (side panel or toggle view)
* Stage/unstage individual files with keyboard shortcuts (Space, Enter)
* Stage/unstage all with single command (Ctrl+A)
* Support partial staging (hunk-level) for files with multiple changes
* Filter by file type or status (modified, new, deleted)
* Search files by name

 **Acceptance Criteria** :

* Navigating files is instant and responsive
* Diff preview updates in real-time as selection changes
* Partial staging works for at least 90% of common diff scenarios
* File count indicator shows staged vs. total modified
* Visual distinction between staged/unstaged states

---

### 3. Guided Commits

 **User Story** : As a developer, I want help writing good commit messages so I can maintain a clean, understandable history.

 **Requirements** :

* Multi-line commit message editor within TUI
* Show staged files before committing
* Provide commit message templates/examples
* Validate message format (warn on missing subject, overly long lines)
* Optional AI suggestions for commit message based on staged changes
* Preview commit before finalizing
* Amend previous commit option

 **Acceptance Criteria** :

* Message editor supports standard Vim/Emacs-like keybindings
* Validation warnings are helpful, not blocking (can override)
* AI suggestions appear within 2 seconds
* Commit operation fails gracefully with clear error if Git rejects it

---

### 4. Visual Branching (TUI)

 **User Story** : As a developer, I want to create, switch, and manage branches through a visual interface so I can organize my work without memorizing commands.

 **Requirements** :

* List all local and remote branches in a tree structure
* Show current branch with visual highlight
* Create new branch from current HEAD or selected commit
* Switch branches with confirmation if uncommitted changes exist
* Delete branches with safety checks
* Rename current branch
* Show branch metadata (last commit, author, date)
* Track relationship to remote branches (upstream info)

 **Acceptance Criteria** :

* Branch list loads in <1s even for repos with 50+ branches
* Current branch is always visually distinct
* Creating/switching branches updates dashboard immediately
* Cannot delete current branch (prevented with helpful message)
* Warns before switching if uncommitted changes would be lost

---

### 5. Commit Timeline & Visual Graph

 **User Story** : As a developer, I want to navigate commit history visually by message and time so I can find and understand past changes without memorizing hashes.

 **Requirements** :

* Display commit graph showing branch structure and merges
* Scrollable timeline with commit messages, authors, dates
* Search commits by message text, author, date range
* Filter by branch
* Select commit to view full details (message, diff, files changed)
* Visual indicators for: HEAD, current branch, tags, merge commits
* Navigate using arrow keys or Vim-like keybindings
* Copy commit hash to clipboard for external use

 **Acceptance Criteria** :

* Timeline renders 100+ commits without performance degradation
* Graph accurately represents branch topology
* Search returns results in <500ms for repos with 1000+ commits
* Commit details view shows complete diff with syntax highlighting
* Timeline updates when new commits are created

---

### 6. Safe Time Travel (Reset & Restore)

 **User Story** : As a developer, I want to safely restore previous states or undo mistakes so I can experiment without fear of losing work.

 **Requirements** :

* Navigate to any commit in timeline and create branch from it
* Soft reset to previous commit (keeps changes in working tree)
* Mixed reset to previous commit (unstages changes)
* Hard reset with explicit confirmation and reflog backup mention
* Restore individual files from previous commits
* Reflog viewer for recovering "lost" commits
* Clear explanations of what each operation does before executing
* Warn about uncommitted work before destructive operations

 **Acceptance Criteria** :

* All reset operations require explicit confirmation
* Confirmation dialogs explain impact in plain English
* Hard reset shows 2-step confirmation with warning message
* Reflog viewer displays entries in chronological order
* File restore works for deleted files
* Operations default to safest option (soft reset over hard)

---

### 7. Reflog Recovery

 **User Story** : As a developer, I want to recover commits that seem "lost" so I can undo mistakes or find work I thought was gone.

 **Requirements** :

* Display reflog entries in chronological order (most recent first)
* Show operation type (commit, reset, checkout, merge, etc.)
* Include commit message and timestamp for each entry
* Preview commit diff before recovery
* Create branch from reflog entry
* Reset to reflog entry with safety confirmations
* Filter reflog by operation type or date range

 **Acceptance Criteria** :

* Reflog loads entries for past 90 days (Git default)
* Each entry clearly shows what operation created it
* Recovery operations follow same safety patterns as timeline actions
* User can preview changes before committing to recovery

---

### 8. GitHub Integration (TUI)

 **User Story** : As a developer, I want to manage GitHub repositories, pull requests, and CI/CD from the terminal so I don't have to leave my workflow.

 **Requirements** :

* Authenticate with GitHub via OAuth device flow (no PAT copy-paste needed)
* Create new GitHub repository (public or private)
* Set repository description and default branch name
* Add repository as remote to local Git repo
* Push local repo to newly created GitHub repo
* List current collaborators for connected repo
* Add collaborators by GitHub username
* Remove collaborators with confirmation
* View collaborator permissions (read, write, admin)
* List open/closed pull requests with full details
* View PR files changed, reviews, and mergeable status
* Merge pull requests (merge, squash, or rebase strategies)
* Close pull requests with confirmation
* View GitHub Actions workflow runs and job status
* Drill into individual job logs for debugging

 **Acceptance Criteria** :

* OAuth device flow completes without user needing to copy tokens
* Authentication persists across sessions (secure token storage in OS keychain)
* Repository creation completes in <5s
* Push operation shows progress indicator
* Collaborator operations reflect in GitHub within 10s
* PR list/detail loads within 2s
* Merge method selection works correctly for all three strategies
* Actions log viewer displays complete job output
* API errors are translated to user-friendly messages
* Rate limiting is handled gracefully with retry logic

---

### 9. AI Mentor Layer

 **User Story** : As a developer, I want an AI assistant that understands my repository context and explains Git operations in plain English so I can learn while I work.

 **Requirements** :

#### Context Analysis

* Analyze current repo state (branch, uncommitted changes, conflicts)
* Understand selected commits or ranges
* Parse and explain Git error messages

#### Capabilities

* **Explain Mode** : Describe what's currently happening in the repo
* "You're on branch `feature-login` with 3 uncommitted files"
* "This merge commit brought changes from `main` into your branch"
* **Recommend Mode** : Suggest safest next actions
* "To save your work before switching branches, you should commit or stash"
* "Use a new branch instead of reset to preserve this commit"
* **Warn Mode** : Alert about risky operations
* "Hard reset will permanently delete uncommitted work—are you sure?"
* "This rebase will rewrite public history; consider merge instead"
* **Error Explanation** : Translate Git errors to plain English
* Git error: `fatal: refusing to merge unrelated histories`
* AI: "These branches don't share a common ancestor. Use `--allow-unrelated-histories` if you're combining separate projects, or check if you're in the right repository."
* **Learn Mode** : Explain Git concepts in depth on demand
* **Ask Mode** : Free-form Q&A about Git operations
* **Review Mode** : Analyze staged changes for potential issues
* **Merge Resolution** : AI-powered conflict resolution suggestions
* **Reset Recommendation** : Suggest safest reset type for the situation
* **Gitignore Generation** : Generate project-specific .gitignore files

#### Technical Implementation

* **Multi-provider architecture** with common `AiProvider` trait:
  * Amazon Bedrock via AWS Lambda (Python 3.12 backend)
  * OpenAI-compatible API (OpenAI and OpenRouter)
  * Anthropic native Messages API
  * Ollama for local/offline inference
* API Gateway with API key auth + usage plan (5,000 req/month, 10 req/sec)
* Context sent: repo state, command intent, relevant diffs, error messages
* Non-blocking: AI calls run on a background thread via `mpsc::channel`
* Response caching with 5-minute TTL and 50-entry max
* Automatic retry with exponential backoff (up to 2 retries)
* Fallback to basic help text if AI unavailable
* Privacy: diffs truncated to 4,000 chars
* 9 specialized prompt templates for different interaction modes
* 12 distinct AI action types dispatched through a unified pipeline

 **Acceptance Criteria** :

* AI responses appear in <3 seconds (90th percentile)
* Explanations are accurate for 95% of common Git scenarios
* Recommendations clearly indicate safety level (safe/caution/destructive)
* Error explanations include both "what happened" and "how to fix"
* User can disable AI layer via config if desired
* All 5 providers work correctly with provider-specific auth
* Backend handles rate limiting and retries gracefully
* Cached responses are returned instantly on repeat queries

---

### 10. Stash Management

 **User Story** : As a developer, I want to quickly save and restore uncommitted work so I can switch contexts without losing changes.

 **Requirements** :

* List all stashes with index, message, and branch
* Push current changes to stash with optional message
* Pop stash (apply + remove) by index
* Apply stash (keep in list) by index
* Drop individual stash entries with confirmation
* Clear all stashes with safety confirmation
* Preview stash diff before applying

 **Acceptance Criteria** :

* Stash list updates immediately after push/pop/drop operations
* Pop and apply correctly restore changes to working tree
* Clear operation requires explicit confirmation
* Stash diff preview loads in <1s
* Works correctly with both staged and unstaged changes

---

### 11. Merge/Conflict Resolution

 **User Story** : As a developer, I want to resolve merge conflicts visually and understand each conflict so I can merge branches confidently without losing code.

 **Requirements** :

* Auto-detect merge, rebase, and cherry-pick in progress
* List all conflicted files with file status
* Navigate between conflict regions within a file
* Preview both sides of each conflict (current/HEAD vs incoming)
* Support both standard and diff3 conflict marker styles
* Resolve individual regions: accept current, accept incoming, or AI suggestion
* AI-powered merge resolution with ACCEPT_CURRENT/ACCEPT_INCOMING/MERGE_BOTH recommendations
* Stage resolved files
* Continue or abort the merge/rebase/cherry-pick operation
* Pre-merge conflict check using `git merge-tree` (with legacy fallback)

 **Acceptance Criteria** :

* Correctly detects all three in-progress operation types
* Conflict markers are parsed accurately for standard and diff3 styles
* Region navigation works smoothly with keyboard shortcuts
* AI resolution suggestions are contextually appropriate
* Continue/abort operations work for merge, rebase, and cherry-pick
* Resolved files are properly staged

---

### 12. Workflow Builder

 **User Story** : As a developer, I want to visually create GitHub Actions workflows so I can set up CI/CD without writing YAML from scratch.

 **Requirements** :

* Visual node-based workflow editor
* Supported step types: Checkout, Setup (language), Run Command, Cache, Upload Artifact, Download Artifact, Deploy
* Add, edit, and delete workflow steps
* Configure trigger events (push, pull_request, schedule, workflow_dispatch, release)
* Define connections between steps (execution order)
* Preview generated YAML before saving
* Export workflow to `.github/workflows/` directory

 **Acceptance Criteria** :

* All step types generate valid GitHub Actions YAML
* Trigger configuration maps correctly to YAML `on:` section
* Node connections produce correct `needs:` dependencies
* Generated YAML passes GitHub Actions syntax validation
* Preview mode shows correctly formatted YAML

---

### 13. Git Bisect

 **User Story** : As a developer, I want to find the commit that introduced a bug using a guided binary search so I can identify regressions quickly.

 **Requirements** :

* Three-phase UI: setup (pick good/bad commits), in-progress (mark commits), result (display bad commit)
* Select bad and good commits from visual commit list
* Display current bisect commit with hash, message, and context
* Show estimated steps remaining (log₂ calculation)
* Mark commits as good, bad, or skip
* View bisect log showing all marked commits
* Reset bisect to return to normal state

 **Acceptance Criteria** :

* Bisect correctly narrows down to the first bad commit
* Steps remaining estimate is accurate
* Skip operation works for untestable commits
* Reset cleanly returns to pre-bisect state
* Bisect log accurately reflects all marking decisions

---

### 14. Cherry-Pick

 **User Story** : As a developer, I want to selectively apply commits from other branches so I can port specific changes without merging entire branches.

 **Requirements** :

* Three-phase UI: select source branch, select commits, preview and execute
* List branches available as cherry-pick sources
* Show commits unique to the source branch (not already in current branch)
* Preview diff for selected commit before cherry-picking
* Support cherry-picking single or multiple commits
* Handle conflicts with abort/continue workflow
* Detect and display when cherry-pick is already in progress

 **Acceptance Criteria** :

* Only shows commits not already present in current branch
* Diff preview accurately shows what will be applied
* Multiple commit cherry-pick applies in correct order
* Conflict resolution integrates with merge resolve view
* Abort cleanly reverts to pre-cherry-pick state

---

## Technical Architecture

### Technology Stack

 **Frontend (TUI Client)** :

* **Language** : Rust (safety, performance, zero-cost abstractions)
* **TUI Framework** : `ratatui` 0.30 (rendering) + `crossterm` 0.29 (terminal manipulation)
* **Git Integration** : Shell-based execution of Git commands via `std::process::Command` (source of truth)
* **HTTP Client** : `reqwest` 0.12 (blocking + rustls-tls) for GitHub API and AI backend
* **Serialization** : `serde` + `serde_json` + `toml` for API payloads and config
* **Config** : `dirs` for cross-platform config directory, TOML format
* **Error handling** : `anyhow` for ergonomic error propagation
* **Clipboard** : `cli-clipboard` for hash/content copy
* **Secrets** : `keyring` for OS keychain integration

 **Backend (AI Mentor)** :

* **Platform** : AWS Lambda (serverless, pay-per-use)
* **Runtime** : Python 3.12
* **LLM Provider** : Amazon Bedrock (Claude 3 Sonnet — `anthropic.claude-3-sonnet-20240229-v1:0`)
* **API Gateway** : AWS API Gateway with API key auth + usage plan (5,000 req/month, 10 req/sec)
* **Infrastructure** : AWS SAM / CloudFormation (one-command deploy via `deploy.sh`)
* **Testing** : 27 Python unit tests, Lambda CI job in GitHub Actions

 **Direct AI Providers** (alternative to Bedrock backend):

* **OpenAI** : GPT-4o via OpenAI-compatible API
* **Anthropic** : Claude Sonnet via native Messages API
* **OpenRouter** : Multi-model routing via OpenRouter API
* **Ollama** : Local LLM inference (Llama 3.1 default, no API key needed)

---

## Diagrams

### 1. High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                            USER TERMINAL                               │
│                     (keyboard / mouse input)                           │
└───────────────────────────────┬─────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          main.rs (Entry Point)                         │
│  ┌─────────────┐  ┌───────────────┐  ┌──────────────────────────────┐  │
│  │ Terminal     │  │ EventHandler  │  │ draw() — View Router         │  │
│  │ Setup &     │  │ (event.rs)    │  │                              │  │
│  │ Cleanup     │  │               │  │  match app.view {            │  │
│  │ - raw mode  │  │ Background    │  │    Dashboard => dashboard    │  │
│  │ - alt screen│  │ thread polls  │  │    Staging   => staging      │  │
│  │ - panic hook│  │ crossterm     │  │    Commit    => commit       │  │
│  │             │  │ events with   │  │    Branches  => branches     │  │
│  │             │  │ tick timeout  │  │    Timeline  => timeline     │  │
│  │             │  │ (2000ms)      │  │    ...14 views total         │  │
│  │             │  │               │  │  }                           │  │
│  │             │  │ Sends:        │  │  + popup overlay             │  │
│  │             │  │ Key/Mouse/    │  │                              │  │
│  │             │  │ Tick/Resize   │  │                              │  │
│  └─────────────┘  └───────┬───────┘  └──────────────────────────────┘  │
└───────────────────────────┼─────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        app.rs (Central State)                          │
│                                                                        │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────────┐  │
│  │ App struct        │  │ View enum (14)    │  │ Popup enum           │  │
│  │ - running         │  │ - Dashboard       │  │ - None               │  │
│  │ - view            │  │ - Staging         │  │ - Help               │  │
│  │ - popup           │  │ - Commit          │  │ - Confirm{action}    │  │
│  │ - config          │  │ - Branches        │  │ - Input{action}      │  │
│  │ - ai_client       │  │ - Timeline        │  │ - Message            │  │
│  │ - ai_receiver     │  │ - TimeTravel      │  │ - FollowUp{suggest}  │  │
│  │ - status_message  │  │ - Reflog          │  └──────────────────────┘  │
│  │ - *_state (×14)   │  │ - GitHub          │                           │
│  │                    │  │ - AiMentor        │  ┌──────────────────────┐  │
│  │ Methods:           │  │ - Stash           │  │ ConfirmAction enum   │  │
│  │ - handle_key()     │  │ - MergeResolve    │  │ - DeleteBranch       │  │
│  │ - handle_mouse()   │  │ - WorkflowBuilder │  │ - HardReset          │  │
│  │ - refresh()        │  │ - Bisect          │  │ - MixedReset         │  │
│  │ - poll_ai_result() │  │ - CherryPick      │  │ - AbortMerge         │  │
│  │ - start_ai_*()     │  │                   │  │ - MergePullRequest   │  │
│  └──────────────────┘  └──────────────────┘  │ - DiscardFile ...     │  │
│                                               └──────────────────────┘  │
└──────────┬──────────────────────┬──────────────────────┬────────────────┘
           │                      │                      │
           ▼                      ▼                      ▼
┌──────────────────┐  ┌──────────────────────┐  ┌────────────────────────┐
│   src/git/       │  │     src/ui/          │  │     src/ai/            │
│                  │  │                      │  │                        │
│ runner.rs (exec) │  │ dashboard.rs         │  │ client.rs              │
│ status.rs        │  │ staging.rs           │  │  - AiClient            │
│ diff.rs          │  │ commit.rs            │  │  - cache (5min TTL)    │
│ branch.rs        │  │ branches.rs          │  │  - retry + backoff     │
│ log.rs           │  │ timeline.rs          │  │                        │
│ remote.rs        │  │ time_travel.rs       │  │ provider.rs            │
│ stash.rs         │  │ reflog.rs            │  │  - BedrockProvider     │
│ reflog.rs        │  │ github.rs            │  │  - OpenAiProvider      │
│ merge.rs         │  │ ai_mentor.rs         │  │  - AnthropicProvider   │
│ bisect.rs        │  │ stash.rs             │  │  - OllamaProvider      │
│ cherry_pick.rs   │  │ merge_resolve.rs     │  │                        │
│ github_auth.rs   │  │ workflow_builder.rs  │  │ prompts.rs             │
│                  │  │ bisect.rs            │  │  - 9 prompt templates  │
│ All shell out to │  │ cherry_pick.rs       │  │                        │
│ real `git` CLI   │  │ help.rs / utils.rs   │  │ Non-blocking via       │
│ via Command      │  │                      │  │ std::thread + mpsc     │
└──────────────────┘  └──────────────────────┘  └────────────────────────┘
```

### 2. View Navigation Map

```
                              ┌─────────────────┐
                              │    DASHBOARD     │
                              │   (home view)    │
                              └───────┬─────────┘
                                      │
          ┌───────────────────────────┼───────────────────────────┐
          │           │       │       │       │       │           │
          ▼           ▼       ▼       ▼       ▼       ▼           ▼
     ┌─────────┐ ┌────────┐ ┌──┐ ┌────────┐ ┌──┐ ┌────────┐ ┌────────┐
     │Staging  │ │Commit  │ │  │ │Timeline│ │  │ │GitHub  │ │AI      │
     │  [s]    │ │  [c]   │ │  │ │  [l]   │ │  │ │  [g]   │ │Mentor  │
     └─────────┘ └────────┘ │  │ └────────┘ │  │ └────────┘ │  [a]   │
                             │  │            │  │            └────────┘
     ┌─────────┐ ┌────────┐ │  │ ┌────────┐ │  │ ┌────────┐ ┌────────┐
     │Branches │ │Time    │ │  │ │Reflog  │ │  │ │Stash   │ │Merge   │
     │  [b]    │ │Travel  │ │  │ │  [r]   │ │  │ │  [x]   │ │Resolve │
     └─────────┘ │  [t]   │ │  │ └────────┘ │  │ └────────┘ │  [m]   │
                 └────────┘ │  │            │  │            └────────┘
                             │  │            │  │
     ┌─────────┐ ┌────────┐ │  │            │  │
     │Workflow │ │Bisect  │ │  │            │  │
     │Builder  │ │  [B]   │ │  │            │  │
     │  [w]    │ └────────┘ │  │            │  │
     └─────────┘            │  │            │  │
                 ┌────────┐ │  │            │  │
                 │Cherry  │ │  │            │  │
                 │Pick    │ │  │            │  │
                 │  [p]   │ │  │            │  │
                 └────────┘ │  │            │  │
                             │  │            │  │
                             └──┘            └──┘

     Navigation: [q] from any view → back to Dashboard
                 [q] from Dashboard → quit zit
                 [?] from any view → Help popup
                 [Ctrl+C] → force quit

     GitHub Sub-Views:
     ┌────────────────────────────────────────────────┐
     │ GitHub [g]                                     │
     │  ├── Menu (home)                               │
     │  ├── Device Auth (OAuth flow)                  │
     │  ├── Create Repository                         │
     │  ├── Collaborators (list/add/remove)            │
     │  ├── Pull Requests (list → detail)             │
     │  │     └── Detail: Overview / Files / Reviews   │
     │  │         Actions: Merge (3 methods) / Close   │
     │  └── Actions (workflow runs → job detail/logs)  │
     └────────────────────────────────────────────────┘
```

### 3. Event Loop & Data Flow

```
     ┌──────────────────────────────────────────────────────────────┐
     │                    EVENT LOOP (main.rs)                      │
     │                                                              │
     │  loop {                                                      │
     │    ┌─────────────────────────────────────────────────────┐   │
     │    │ 1. RENDER: terminal.draw(|f| draw(f, &app))        │   │
     │    │    - Routes to current view's render() function     │   │
     │    │    - Overlays popup if active                       │   │
     │    └─────────────────────────┬───────────────────────────┘   │
     │                              │                               │
     │                              ▼                               │
     │    ┌─────────────────────────────────────────────────────┐   │
     │    │ 2. WAIT: events.next() blocks until event arrives   │   │
     │    │    (crossterm polling on background thread)          │   │
     │    └─────────────────────────┬───────────────────────────┘   │
     │                              │                               │
     │              ┌───────────────┼───────────────┐               │
     │              ▼               ▼               ▼               │
     │    ┌──────────────┐ ┌──────────────┐ ┌──────────────┐       │
     │    │ Key Event    │ │ Tick Event   │ │ Mouse Event  │       │
     │    │              │ │ (every 2s)   │ │              │       │
     │    │ 1. poll_ai() │ │ 1. poll_ai() │ │ 1. poll_ai() │       │
     │    │ 2. handle_   │ │ 2. refresh() │ │ 2. handle_   │       │
     │    │    key()     │ │ 3. poll      │ │    mouse()   │       │
     │    │              │ │    github    │ │              │       │
     │    └──────┬───────┘ └──────┬───────┘ └──────┬───────┘       │
     │           │                │                │               │
     │           └────────────────┼────────────────┘               │
     │                            ▼                                │
     │    ┌─────────────────────────────────────────────────────┐   │
     │    │ 3. STATE UPDATE                                     │   │
     │    │    - Execute git commands via git::runner            │   │
     │    │    - Update view state structs                       │   │
     │    │    - Set status_message for status bar               │   │
     │    │    - Show popup if confirmation needed               │   │
     │    └─────────────────────────────────────────────────────┘   │
     │                                                              │
     │    if !app.running → break                                   │
     │  }                                                           │
     └──────────────────────────────────────────────────────────────┘
```

### 4. AI Integration Architecture

```
     ┌────────────────────────────────────────────────────────────────┐
     │                     AI CALL LIFECYCLE                          │
     │                                                                │
     │  User triggers AI action (e.g., commit suggest, error explain) │
     │                          │                                     │
     │                          ▼                                     │
     │  ┌──────────────────────────────────────┐                     │
     │  │ app.start_ai_*() in app.rs           │                     │
     │  │  1. Clone Arc<AiClient>              │                     │
     │  │  2. Gather context (repo state,      │                     │
     │  │     staged diff, error msg, etc.)    │                     │
     │  │  3. Set ai_loading = true            │                     │
     │  │  4. Set ai_action = AiAction::*      │                     │
     │  └──────────────┬───────────────────────┘                     │
     │                 │                                              │
     │                 ▼                                              │
     │  ┌──────────────────────────────────────┐                     │
     │  │ std::thread::spawn                   │                     │
     │  │  - Runs AiClient method              │                     │
     │  │  - Checks cache (5min TTL, 50 max)   │                     │
     │  │  - Retries with exponential backoff   │                     │
     │  │    (up to 2 retries)                  │                     │
     │  │  - Sends result via mpsc::channel     │◄──── NON-BLOCKING  │
     │  └──────────────┬───────────────────────┘                     │
     │                 │                                              │
     │                 ▼                                              │
     │  ┌──────────────────────────────────────┐                     │
     │  │ Provider dispatch (provider.rs)      │                     │
     │  │                                      │                     │
     │  │  ┌────────────┐  ┌────────────────┐  │                     │
     │  │  │ Bedrock    │  │ OpenAI-compat  │  │                     │
     │  │  │ (Lambda)   │  │ (OpenAI /      │  │                     │
     │  │  │ x-api-key  │  │  OpenRouter)   │  │                     │
     │  │  └─────┬──────┘  └───────┬────────┘  │                     │
     │  │        │                 │            │                     │
     │  │  ┌─────┴──────┐  ┌──────┴─────────┐  │                     │
     │  │  │ Anthropic  │  │ Ollama         │  │                     │
     │  │  │ (native    │  │ (local, no     │  │                     │
     │  │  │  Messages) │  │  auth needed)  │  │                     │
     │  │  └────────────┘  └────────────────┘  │                     │
     │  └──────────────────────────────────────┘                     │
     │                 │                                              │
     │                 ▼                                              │
     │  ┌──────────────────────────────────────┐                     │
     │  │ poll_ai_result() on each event tick  │                     │
     │  │  - try_recv() on mpsc channel        │                     │
     │  │  - Dispatch based on ai_action:      │                     │
     │  │    CommitSuggest → commit_state.msg   │                     │
     │  │    ExplainRepo   → ai_mentor result   │                     │
     │  │    ExplainError  → status_message     │                     │
     │  │    MergeResolve  → merge suggestion   │                     │
     │  │    ResetSuggest  → time_travel rec    │                     │
     │  │  - Set ai_loading = false             │                     │
     │  └──────────────────────────────────────┘                     │
     └────────────────────────────────────────────────────────────────┘

     AI Action Types (AiAction enum):
     ┌──────────────────┬─────────────────────────────────────────────┐
     │ Action           │ Description                                 │
     ├──────────────────┼─────────────────────────────────────────────┤
     │ CommitSuggest    │ Generate commit message from staged diff    │
     │ ExplainRepo      │ Explain current repository state            │
     │ ExplainError     │ Translate git error to plain English        │
     │ Recommend        │ Suggest safest next actions                 │
     │ HealthCheck      │ Verify AI provider connectivity             │
     │ ReviewDiff       │ Review staged changes for issues            │
     │ AskQuestion      │ Free-form Q&A about Git                    │
     │ Learn            │ Explain a Git concept in depth              │
     │ MergeResolve     │ Suggest conflict resolution strategy        │
     │ MergeStrategy    │ Recommend merge vs rebase approach          │
     │ ResetSuggest     │ Recommend safe reset type                   │
     │ GenerateGitignore│ Generate .gitignore for project type        │
     └──────────────────┴─────────────────────────────────────────────┘
```

### 5. GitHub OAuth Device Flow

```
     ┌──────────┐          ┌────────────┐          ┌──────────────┐
     │   User   │          │   zit TUI  │          │  GitHub API  │
     └────┬─────┘          └─────┬──────┘          └──────┬───────┘
          │                      │                        │
          │  Press [g] → GitHub  │                        │
          │─────────────────────>│                        │
          │                      │                        │
          │                      │  POST /login/device/   │
          │                      │  code                  │
          │                      │  {client_id, scope:    │
          │                      │   "repo,read:user"}    │
          │                      │───────────────────────>│
          │                      │                        │
          │                      │  {user_code,           │
          │                      │   device_code,         │
          │                      │   verification_uri}    │
          │                      │<───────────────────────│
          │                      │                        │
          │  Display:            │                        │
          │  "Go to github.com/  │                        │
          │   login/device and   │                        │
          │   enter: ABCD-1234"  │                        │
          │<─────────────────────│                        │
          │                      │                        │
          │  User enters code    │                        │
          │  in browser ─────────┼───────────────────────>│
          │                      │                        │
          │                      │  Poll: POST /login/    │
          │                      │  oauth/access_token    │
          │                      │  (on each tick event)  │
          │                      │───────────────────────>│
          │                      │                        │
          │                      │  "authorization_       │
          │                      │   pending" (repeat)    │
          │                      │<───────────────────────│
          │                      │         ...            │
          │                      │  {access_token}        │
          │                      │<───────────────────────│
          │                      │                        │
          │                      │  Store token in OS     │
          │                      │  keychain (keyring)    │
          │                      │                        │
          │  "Authenticated as   │                        │
          │   @username"         │                        │
          │<─────────────────────│                        │
          │                      │                        │
```

### 6. Git Operation Safety Layer

```
     ┌────────────────────────────────────────────────────────────────┐
     │              SAFETY CONFIRMATION FLOW                         │
     │                                                                │
     │  User Action (e.g., delete branch, hard reset, discard file)  │
     │                          │                                     │
     │                          ▼                                     │
     │               ┌─────────────────────┐                         │
     │               │ Is this operation   │                         │
     │               │ destructive?        │                         │
     │               └────────┬────────────┘                         │
     │                   Yes/ │ \No                                   │
     │                  /     │  \                                    │
     │                 ▼      │   ▼                                   │
     │  ┌──────────────────┐  │  ┌──────────────────┐               │
     │  │ Show Confirm     │  │  │ Execute directly  │               │
     │  │ Popup with:      │  │  │ + update state    │               │
     │  │ - Plain English  │  │  │ + status message   │               │
     │  │   explanation    │  │  └──────────────────┘               │
     │  │ - Impact warning │  │                                      │
     │  │ - [y] / [n]     │  │                                      │
     │  └────────┬─────────┘  │                                      │
     │      Yes/ │ \No        │                                      │
     │     /     │  \         │                                      │
     │    ▼      │   ▼        │                                      │
     │  Execute  │  Cancel    │                                      │
     │  action   │  + msg     │                                      │
     │    │      │            │                                      │
     │    ▼      │            │                                      │
     │  On Error:│            │                                      │
     │  ┌────────┴──────────────┐                                    │
     │  │ 1. Display error msg  │                                    │
     │  │ 2. start_ai_error_    │                                    │
     │  │    explain() if AI    │                                    │
     │  │    enabled            │                                    │
     │  │ 3. Show FollowUp      │                                    │
     │  │    popup with         │                                    │
     │  │    suggested fixes    │                                    │
     │  └───────────────────────┘                                    │
     └────────────────────────────────────────────────────────────────┘

     Destructive Operations Requiring Confirmation:
     ┌────────────────────────────────────────────────────┐
     │ ConfirmAction        │ Safety Level                │
     ├──────────────────────┼─────────────────────────────┤
     │ HardReset            │ ⚠ DESTRUCTIVE (2-step)     │
     │ DiscardFile          │ ⚠ DESTRUCTIVE              │
     │ ClearStash           │ ⚠ DESTRUCTIVE              │
     │ MixedReset           │ ⚡ CAUTION                  │
     │ SoftReset            │ ⚡ CAUTION                  │
     │ DeleteBranch         │ ⚡ CAUTION                  │
     │ AbortMerge           │ ⚡ CAUTION                  │
     │ RemoveCollaborator   │ ⚡ CAUTION                  │
     │ MergePullRequest     │ ⚡ CAUTION                  │
     │ ClosePullRequest     │ ⚡ CAUTION                  │
     │ ContinueMerge        │ ✓ SAFE (informational)     │
     └──────────────────────┴─────────────────────────────┘
```

### 7. Module Dependency Graph

```
                              main.rs
                                │
                    ┌───────────┼───────────┐
                    │           │           │
                    ▼           ▼           ▼
                event.rs     app.rs     config.rs
                              │ │          │
                    ┌─────────┘ └──────┐   │
                    │                  │   │
                    ▼                  ▼   ▼
               ┌─────────┐      ┌──────────────┐
               │  ui/*   │      │    git/*      │
               │         │      │              │
               │ 14 view │      │  runner.rs ◄─┼── all git modules
               │ renderers│      │  status.rs   │   call run_git()
               │         │      │  diff.rs     │
               │ Each has │      │  branch.rs   │
               │ render() │      │  log.rs      │
               │ function │      │  remote.rs   │
               │         │      │  stash.rs    │
               └─────────┘      │  reflog.rs   │
                                │  merge.rs    │
                                │  bisect.rs   │
               ┌─────────┐      │  cherry_pick │
               │  ai/*   │      │  github_auth │
               │         │      └──────────────┘
               │ client  │
               │ provider│◄── dispatches to 4 providers
               │ prompts │◄── 9 prompt templates
               └─────────┘
                    │
                    ▼
          ┌─────────────────┐
          │  keychain.rs    │
          │  (OS secrets)   │
          └─────────────────┘

     Data ownership: app.rs owns ALL state.
     ui/* modules are pure renderers (read state, produce widgets).
     git/* modules are stateless (run command, return parsed result).
     ai/* modules manage async lifecycle (thread + channel + cache).
```

### 8. Merge/Conflict Resolution Flow

```
     ┌─────────────────────────────────────────────────────────────┐
     │                 MERGE RESOLUTION PIPELINE                   │
     │                                                              │
     │  Detect merge state:                                        │
     │  ┌────────────────────────────────────────────────────────┐  │
     │  │ Check for:                                             │  │
     │  │  .git/MERGE_HEAD      → merge in progress              │  │
     │  │  .git/rebase-merge/   → rebase in progress             │  │
     │  │  .git/CHERRY_PICK_HEAD → cherry-pick in progress       │  │
     │  └───────────────┬────────────────────────────────────────┘  │
     │                  │                                           │
     │                  ▼                                           │
     │  ┌────────────────────────────────────────────────────────┐  │
     │  │ List conflicted files (git status --porcelain=v2)      │  │
     │  │ For each file:                                         │  │
     │  │   1. Read raw file content                             │  │
     │  │   2. Parse conflict markers:                           │  │
     │  │      <<<<<<< HEAD                                      │  │
     │  │      (current/ours content)                             │  │
     │  │      ||||||| (base, if diff3 style)                    │  │
     │  │      =======                                            │  │
     │  │      (incoming/theirs content)                          │  │
     │  │      >>>>>>> branch-name                                │  │
     │  │   3. Build ConflictRegion structs                      │  │
     │  └───────────────┬────────────────────────────────────────┘  │
     │                  │                                           │
     │                  ▼                                           │
     │  ┌────────────────────────────────────────────────────────┐  │
     │  │ Resolution options per region:                         │  │
     │  │                                                        │  │
     │  │  [c] Accept Current (HEAD/ours)                        │  │
     │  │  [i] Accept Incoming (theirs)                          │  │
     │  │  [a] Ask AI for smart merge suggestion                 │  │
     │  │      └─► AI returns: ACCEPT_CURRENT / ACCEPT_INCOMING  │  │
     │  │          / MERGE_BOTH with resolved content             │  │
     │  │                                                        │  │
     │  │  After all regions resolved:                           │  │
     │  │  [Enter] Stage file → git add                          │  │
     │  │  [C] Continue merge/rebase/cherry-pick                 │  │
     │  │  [A] Abort merge/rebase/cherry-pick                    │  │
     │  └────────────────────────────────────────────────────────┘  │
     └─────────────────────────────────────────────────────────────┘
```

### 9. Bisect Workflow State Machine

```
     ┌─────────────────────────────────────────────────────────┐
     │                BISECT STATE MACHINE                     │
     │                                                          │
     │  Phase 1: SETUP (commit picker)                         │
     │  ┌──────────────────────────────────────────────────┐   │
     │  │  Show commit list from git log                   │   │
     │  │  User selects:                                   │   │
     │  │    [b] Mark as BAD commit (known broken)         │   │
     │  │    [g] Mark as GOOD commit (known working)       │   │
     │  │  → git bisect start                              │   │
     │  │  → git bisect bad <hash>                         │   │
     │  │  → git bisect good <hash>                        │   │
     │  └────────────────────┬─────────────────────────────┘   │
     │                       │                                  │
     │                       ▼                                  │
     │  Phase 2: IN PROGRESS (binary search)                   │
     │  ┌──────────────────────────────────────────────────┐   │
     │  │  Git checks out midpoint commit                  │   │
     │  │  Display:                                        │   │
     │  │    - Current commit hash + message               │   │
     │  │    - Steps remaining (log₂ estimate)             │   │
     │  │    - Revisions left to test                      │   │
     │  │  User marks:                                     │   │
     │  │    [g] GOOD → git bisect good                    │   │
     │  │    [b] BAD  → git bisect bad                     │   │
     │  │    [s] SKIP → git bisect skip                    │   │
     │  │  Repeat until found                              │   │
     │  └────────────────────┬─────────────────────────────┘   │
     │                       │                                  │
     │                       ▼                                  │
     │  Phase 3: FOUND (result display)                        │
     │  ┌──────────────────────────────────────────────────┐   │
     │  │  Display the first bad commit:                   │   │
     │  │    - Hash, author, date, message                 │   │
     │  │  Options:                                        │   │
     │  │    [l] View bisect log                           │   │
     │  │    [r] Reset bisect (git bisect reset)           │   │
     │  │    [q] Return to dashboard                       │   │
     │  └──────────────────────────────────────────────────┘   │
     └─────────────────────────────────────────────────────────┘
```

### 10. Configuration & Secrets Architecture

```
     ┌─────────────────────────────────────────────────────────────┐
     │                 CONFIGURATION SYSTEM                        │
     │                                                              │
     │  ~/.config/zit/config.toml                                  │
     │  ┌──────────────────────────────────────────────────────┐   │
     │  │ [general]                                            │   │
     │  │   tick_rate_ms = 2000                                │   │
     │  │   confirm_destructive = true                         │   │
     │  │                                                      │   │
     │  │ [ui]                                                 │   │
     │  │   color_scheme = "default"                           │   │
     │  │   show_help_hints = true                             │   │
     │  │                                                      │   │
     │  │ [github]                                             │   │
     │  │   username = "..."    # cached after auth            │   │
     │  │   # tokens stored in OS keychain, not here           │   │
     │  │                                                      │   │
     │  │ [ai]                                                 │   │
     │  │   enabled = false                                    │   │
     │  │   provider = "bedrock"  # or openai/anthropic/       │   │
     │  │                         #    openrouter/ollama        │   │
     │  │   model = "..."         # provider-specific default  │   │
     │  │   endpoint = "..."      # auto-set per provider      │   │
     │  │   timeout_secs = 30                                  │   │
     │  └──────────────────────────────────────────────────────┘   │
     │                                                              │
     │  Secret Resolution Order:                                   │
     │  ┌──────────────────────────────────────────────────────┐   │
     │  │ 1. OS Keychain (keyring crate)                       │   │
     │  │    └─ "zit-github-token", "zit-ai-api-key"           │   │
     │  │ 2. Config file (plaintext fallback)                  │   │
     │  │ 3. Environment variable: ZIT_AI_API_KEY              │   │
     │  │                                                      │   │
     │  │ On first run: if plaintext token found in config,    │   │
     │  │ migrate to OS keychain automatically (keychain.rs)   │   │
     │  └──────────────────────────────────────────────────────┘   │
     │                                                              │
     │  Default Models per Provider:                               │
     │  ┌────────────────┬─────────────────────────────────────┐   │
     │  │ bedrock        │ claude-3-sonnet                      │   │
     │  │ openai         │ gpt-4o                               │   │
     │  │ anthropic      │ claude-sonnet-4-20250514             │   │
     │  │ openrouter     │ anthropic/claude-sonnet-4            │   │
     │  │ ollama         │ llama3.1                             │   │
     │  └────────────────┴─────────────────────────────────────┘   │
     └─────────────────────────────────────────────────────────────┘
```

### 11. CI/CD Pipeline

```
     ┌─────────────────────────────────────────────────────────────┐
     │              GitHub Actions CI Pipeline                     │
     │              (on push/PR to main)                           │
     │                                                              │
     │  ┌──────────────────────────────────────────────────────┐   │
     │  │ Job: Rust CI (matrix: ubuntu, macos, windows)        │   │
     │  │                                                      │   │
     │  │  Step 1: cargo fmt --all -- --check                  │   │
     │  │          └─ Fail if formatting is wrong               │   │
     │  │                      │                                │   │
     │  │                      ▼                                │   │
     │  │  Step 2: cargo clippy --all-targets -- -D warnings   │   │
     │  │          └─ Warnings treated as errors                │   │
     │  │                      │                                │   │
     │  │                      ▼                                │   │
     │  │  Step 3: cargo test --all-targets                    │   │
     │  │          └─ Unit + integration tests                  │   │
     │  └──────────────────────────────────────────────────────┘   │
     │                                                              │
     │  ┌──────────────────────────────────────────────────────┐   │
     │  │ Job: Lambda CI (ubuntu, Python 3.12)                 │   │
     │  │                                                      │   │
     │  │  Step 1: pip install -r requirements.txt             │   │
     │  │  Step 2: python -m pytest tests/ -v                  │   │
     │  │          └─ 27 unit tests for AI backend              │   │
     │  └──────────────────────────────────────────────────────┘   │
     │                                                              │
     │  Additional workflows:                                      │
     │  - Release: build binaries for all platforms                 │
     │  - Audit: cargo audit for dependency vulnerabilities         │
     │  - Deploy: SAM deploy for Lambda backend                    │
     └─────────────────────────────────────────────────────────────┘
```

### 12. End-to-End User Workflow: Commit with AI

```
     User                    zit TUI                 git CLI            AI Backend
      │                        │                        │                    │
      │  Launch `zit`          │                        │                    │
      │───────────────────────>│                        │                    │
      │                        │  git status            │                    │
      │                        │  --porcelain=v2        │                    │
      │                        │───────────────────────>│                    │
      │                        │  branch, files, state  │                    │
      │                        │<───────────────────────│                    │
      │  Dashboard displayed   │                        │                    │
      │<───────────────────────│                        │                    │
      │                        │                        │                    │
      │  Press [s] (staging)   │                        │                    │
      │───────────────────────>│                        │                    │
      │                        │  git diff              │                    │
      │                        │───────────────────────>│                    │
      │                        │  file diffs            │                    │
      │                        │<───────────────────────│                    │
      │  File list + diffs     │                        │                    │
      │<───────────────────────│                        │                    │
      │                        │                        │                    │
      │  Space (stage file)    │                        │                    │
      │───────────────────────>│  git add <file>        │                    │
      │                        │───────────────────────>│                    │
      │  ✓ File staged         │                        │                    │
      │<───────────────────────│                        │                    │
      │                        │                        │                    │
      │  Press [c] (commit)    │                        │                    │
      │───────────────────────>│  git diff --cached     │                    │
      │                        │  --stat                │                    │
      │                        │───────────────────────>│                    │
      │                        │  staged diff stat      │                    │
      │                        │<───────────────────────│                    │
      │                        │                        │                    │
      │                        │  [background thread]   │                    │
      │                        │  suggest_commit_msg()  │                    │
      │                        │────────────────────────┼───────────────────>│
      │                        │                        │                    │
      │  Commit editor shown   │                        │  LLM generates    │
      │  (user types message)  │                        │  suggestion       │
      │<───────────────────────│                        │                    │
      │                        │  AI suggestion arrives  │                    │
      │                        │<────────────────────────┼───────────────────│
      │  "AI suggests: ..."    │                        │                    │
      │<───────────────────────│                        │                    │
      │                        │                        │                    │
      │  Enter (confirm)       │                        │                    │
      │───────────────────────>│  git commit -m "..."   │                    │
      │                        │───────────────────────>│                    │
      │                        │  commit created        │                    │
      │                        │<───────────────────────│                    │
      │  "Committed: abc1234"  │                        │                    │
      │<───────────────────────│                        │                    │
```

---

### Key Design Decisions

1. **Shell-Based Git Execution** : Use actual Git binary, not reimplementation

* **Rationale** : Git is the source of truth; ensures compatibility and correctness
* **Trade-off** : Slightly slower than library calls, but negligible in practice

2. **TUI Over GUI** : Terminal-native interface

* **Rationale** : Developers already work in terminals; no context switching
* **Trade-off** : Limited visual richness vs. GUI, but faster workflow

3. **Opinionated Defaults** : Non-destructive operations by default

* **Rationale** : Safety first, especially for beginners
* **Trade-off** : Advanced users may find extra confirmations annoying (mitigated via config)

4. **AI as Optional Layer** : Works without AI, enhanced with it

* **Rationale** : Not everyone wants/needs AI; tool should be useful standalone
* **Trade-off** : Two codepaths to maintain

5. **Multi-Provider AI** : Support 5 AI backends (Bedrock, OpenAI, Anthropic, OpenRouter, Ollama)

* **Rationale** : Users have different preferences, budgets, and privacy requirements
* **Trade-off** : More provider code to maintain, but common trait interface keeps it manageable

6. **Non-Blocking AI** : All AI calls on background threads with mpsc channels

* **Rationale** : UI must never freeze waiting for network responses
* **Trade-off** : More complex state management, but essential for good UX

---

## User Workflows

### Workflow 1: First-Time Commit

 **Actor** : Junior developer making their first commit

1. Open zit in repository: `zit`
2. Dashboard shows "3 modified files, 0 staged"
3. Navigate to staging view (keyboard shortcut: `s`)
4. Select files to stage using arrow keys + Space
5. Press `c` to open commit interface
6. Type commit message; AI suggests: "Add user authentication endpoints"
7. Confirm commit; dashboard updates to show clean state
8. AI explains: "You've created a snapshot of your changes. Your work is now saved in Git history."

 **Success Metrics** :

* Time to first commit: <2 minutes
* User completes workflow without consulting external documentation
* User understands what they did (measured via optional feedback prompt)

---

### Workflow 2: Recovering from a Mistake

 **Actor** : Developer who accidentally hard reset

1. User realizes they lost a commit after hard reset
2. Opens zit: `zit`
3. Dashboard shows AI warning: "Recent reset detected. Your commit may be in reflog."
4. Press `r` to open reflog viewer
5. Sees deleted commit in list with message and timestamp
6. Selects commit, presses `b` to create recovery branch
7. AI confirms: "Branch `recovery-feb10` created from lost commit. Your work is safe."

 **Success Metrics** :

* Time to recover: <1 minute
* Recovery success rate: 100% if commit is in reflog
* User confidence increase (measured via survey)

---

### Workflow 3: Creating a GitHub Repository

 **Actor** : Developer starting a new project

1. Initialize local repo: `git init` (or `zit init` if we build that)
2. Make initial commits using zit
3. Press `g` to open GitHub integration
4. Select "Create Repository"
5. Enter name: `my-awesome-project`, description, visibility (private)
6. zit creates repo, adds remote, asks to push
7. Confirm push; AI explains: "Your local commits are now on GitHub at github.com/username/my-awesome-project"

 **Success Metrics** :

* Time to GitHub: <3 minutes from first commit
* Zero failed pushes due to misconfiguration
* User successfully shares repo link with collaborator

---

## Non-Functional Requirements

### Performance

* TUI must respond to user input within 100ms (perceived instant)
* Commit timeline renders 100+ commits in <1 second
* AI responses delivered in <3 seconds (p90)
* Dashboard refresh: <500ms

### Reliability

* Git operations succeed 99.9% of the time (failures only due to Git errors)
* AI backend uptime: 99.5%
* Graceful degradation: tool works without AI layer
* Data loss: zero (all operations use Git's ACID guarantees)

### Security

* GitHub PAT stored in system keychain (macOS Keychain, Windows Credential Manager, Linux Secret Service)
* No repo content sent to AI unless explicitly user-initiated
* AI backend API keys rotated every 90 days
* HTTPS for all network communication

### Usability

* New user can make first commit without external help: 80% success rate
* Keyboard-driven navigation: all features accessible without mouse
* Color-blind accessible color scheme (tested with simulators)
* Help text available via `?` key in any view

### Compatibility

* Supported Git versions: 2.30+ (past 3 years)
* Supported terminals: all xterm-compatible terminals
* Supported platforms: macOS, Linux, Windows (via WSL or native)
* Minimum terminal size: 80x24 characters

---

## Success Metrics (OKRs)

### Objective 1: Make Git approachable for beginners

 **Key Results** :

* 70% of new users complete their first commit workflow without external help
* 50% of users report feeling "more confident with Git" after 1 week (survey)
* Average time to first commit reduced from 10 minutes (git CLI) to <3 minutes

### Objective 2: Reduce Git-related mistakes

 **Key Results** :

* 80% reduction in "destructive operation regret" incidents (measured via reflog recovery usage)
* Zero data loss incidents due to zit bugs (Git errors excluded)
* 60% of users report "fewer Git mistakes" after 1 month (survey)

### Objective 3: Drive adoption and engagement

 **Key Results** :

* 10,000 total installs within 6 months of launch
* 30% DAU/MAU ratio (daily active users / monthly active users)
* 500 GitHub stars within 3 months
* 20% of users enable AI mentor within first session

### Objective 4: Validate AI mentor value

 **Key Results** :

* 70% of AI interactions rated "helpful" or "very helpful"
* 40% of users who try AI mentor keep it enabled long-term
* AI explains Git errors correctly in 95% of cases (manual review)
* Average AI response latency <3 seconds (p90)

---

## Risks & Mitigations

### Risk 1: Git Version Fragmentation

 **Probability** : Medium

 **Impact** : High

 **Description** : Different Git versions may have incompatible output formats, breaking parsing.

 **Mitigation** :

* Require Git 2.30+ (widely available, stable output)
* Use `--porcelain` flags where available for stable output
* Extensive testing across Git versions 2.30, 2.35, 2.40, latest
* Graceful error handling with version detection and user notification

---

### Risk 2: AI Hallucination or Bad Advice

 **Probability** : Medium

 **Impact** : High

 **Description** : LLM gives incorrect Git advice, leading to user mistakes.

 **Mitigation** :

* Context prompts explicitly instruct AI to prioritize safety and admit uncertainty
* AI recommendations labeled with confidence levels (high/medium/low)
* Destructive operations always require manual confirmation regardless of AI advice
* Feedback mechanism to report bad AI advice
* Regular review of AI responses for quality assurance
* Fallback to curated help text for critical operations

---

### Risk 3: Performance on Large Repos

 **Probability** : Low

 **Impact** : Medium

 **Description** : TUI becomes sluggish on repos with 10,000+ commits or 1,000+ files.

 **Mitigation** :

* Pagination for commit timeline (load 100 commits at a time)
* Virtual scrolling for file lists (render only visible items)
* Git operations run asynchronously with loading indicators
* Performance benchmarking on Linux kernel repo (1M+ commits)
* Configurable limits for history depth and file counts

---

### Risk 4: Cross-Platform Terminal Incompatibility

 **Probability** : Medium

 **Impact** : Medium

 **Description** : TUI rendering breaks on certain terminal emulators.

 **Mitigation** :

* Test on top 10 terminal emulators (Terminal.app, iTerm2, Alacritty, Windows Terminal, GNOME Terminal, etc.)
* Use crossterm's compatibility layer
* Fallback to simple line-based UI if TUI initialization fails
* User-selectable color schemes (including monochrome)

---

### Risk 5: GitHub API Rate Limiting

 **Probability** : High

 **Impact** : Low

 **Description** : Heavy users hit GitHub API rate limits (5,000 requests/hour for authenticated users).

 **Mitigation** :

* Cache repository metadata locally (refresh on demand)
* Batch API requests where possible
* Display remaining rate limit in GitHub integration view
* Graceful error handling with retry after rate limit resets
* Educate users about rate limits via AI mentor

---

## Appendix

### Glossary

* **TUI** : Text User Interface (terminal-based graphical interface)
* **Reflog** : Git's reference log (history of HEAD movements)
* **Detached HEAD** : Git state where HEAD points to a commit, not a branch
* **SHA/Hash** : Commit identifier (e.g., `a3f7d8e`)
* **Porcelain** : Git commands designed for humans (vs. "plumbing" for scripts)
* **Hunk** : A contiguous section of changed lines in a diff

### References

* Git Documentation: https://git-scm.com/doc
* GitHub REST API: https://docs.github.com/en/rest
* Ratatui Docs: https://ratatui.rs
* Amazon Bedrock: https://aws.amazon.com/bedrock/

### Competitive Analysis

| Tool                     | Type          | Strengths                                    | Weaknesses                             |
| ------------------------ | ------------- | -------------------------------------------- | -------------------------------------- |
| **GitKraken**      | GUI           | Visual, beginner-friendly                    | Requires leaving terminal, proprietary |
| **lazygit**        | TUI           | Fast, keyboard-driven                        | Lacks AI, steep learning curve         |
| **GitHub Desktop** | GUI           | Polished, GitHub integration                 | Limited Git features, GUI-only         |
| **Magit (Emacs)**  | Editor Plugin | Powerful, text-based                         | Requires Emacs, not standalone         |
| **zit**            | AI TUI        | Learning-focused, AI mentor, terminal-native | Growing community                      |

### User Personas

**Persona 1: Alex the Bootcamp Grad**

* **Age** : 24
* **Experience** : 3 months coding
* **Goal** : Land first dev job
* **Pain Point** : Scared of breaking Git history during interviews
* **zit Value** : Confidence through guardrails and AI explanations

**Persona 2: Jordan the Self-Taught Developer**

* **Age** : 29
* **Experience** : 1 year coding
* **Goal** : Contribute to open-source
* **Pain Point** : Doesn't understand advanced Git (rebase, cherry-pick)
* **zit Value** : Learn-by-doing with real-time mentorship

**Persona 3: Sam the Senior Engineer**

* **Age** : 35
* **Experience** : 10 years coding
* **Goal** : Increase productivity, reduce context switching
* **Pain Point** : Tired of memorizing Git commands, wants speed
* **zit Value** : Fast TUI workflows with AI for edge cases
