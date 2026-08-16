# Project Submission Report

## 1. Student Details

- **Full Name:** Kirui Sharlet Jerono
- **GitHub Username:** Sharlet-Kirui
- **Email:** Sharlet.kirui@strathmore.edu

---

## 2. Deployed Project Link

- **Live GitHub Pages URL:** https://is-project-2026.github.io/recipe-book-160588/index.html

---

## 3. Reflection — Grounded in Your Git History

> **Rules:** Every answer below **must include a direct link** to the specific commit, PR, issue, or branch in your repository that demonstrates what you are describing. Answers without working links will not be graded. Generic explanations that could apply to any project will receive zero marks.
>
> **Marks:** A (2 marks) · B (1 mark) · C (1 mark) · D (1 mark) = **5 marks total**

### A. Your Best Commit

Paste the URL of the commit in your history that you think best demonstrates clean conventional commit practice (good type tag, clear subject, meaningful body or footer).

- **Commit URL:** (https://github.com/IS-PROJECT-2026/recipe-book-160588/commit/857ce130045553b475dde6216bbfed0bf28b7640)
- **Why this one?** This commit demonstrates excellent conventional practice by using a clear structural type and scope (feat(form)) paired with an imperative subject line to define the new feature. Additionally, the descriptive body perfectly explains the technical reasoning behind the changes across multiple files, and the Closes #8 footer automates Agile issue tracking by linking directly to the project board.

### B. A Mistake or Struggle

Link to a commit, PR, or issue where something went wrong — a bad commit message you had to fix, a branch you had to delete and recreate, a PR that needed rework, or a deployment that broke. 

- **Link to the evidence:** [https://github.com/IS-PROJECT-2026/recipe-book-160588/pull/34](https://github.com/IS-PROJECT-2026/recipe-book-160588/pull/34)
- **What happened and how did you recover?** I mistakenly bundled two separate tasks—building the HTML UI and writing the JavaScript Firestore logic—into a single branch. Because of this scope creep, my original PR description only included Closes #8. I merged the PR before realizing Issue #9 was left stranded as an open ticket. To recover and maintain traceability, I edited the merged PR description to include Issue #9 for documentation purposes, and then I navigated to Issue #9 to manually close it, ensuring my project board accurately reflected the completed work.

### C. A Pull Request You're Proud Of

Paste the URL of the PR that best shows your self-review process — one where the description is clear, the issue linkage is correct, and the diff tells a coherent story.

- **PR URL:** (https://github.com/IS-PROJECT-2026/recipe-book-160588/pull/29/)
- **What did you check before merging?** Before merging, I verified that the simultaneous-edit merge conflict in style.css was successfully resolved without breaking the existing UI layouts. I also ensured that all PR metadata: including assignees, labels, milestones, and issue-closing keywords was fully configured to automate our project tracking."

### D. One Thing You Would Do Differently

If you had to restart this project from scratch with everything you know now, name one specific workflow decision you would change (not a code change — a Git/project management decision).

- **What would you change?** If I were to restart this project, I would define my issues with much stricter, atomic scoping so that one issue maps exactly to one small, focused branch. 
Instead of bundling the frontend HTML UI and the backend Firestore database logic into a single workflow, breaking them into strictly separated, bite-sized tasks from the start would prevent scope creep and make Pull Requests much easier to review.
- **Link to the evidence of the original decision:** [https://github.com/IS-PROJECT-2026/recipe-book-160588/pull/34](https://github.com/IS-PROJECT-2026/recipe-book-160588/pull/34)

---

## 4. Screenshots of Key GitHub Features

Demonstrate your workflow mechanics by embedding your screenshots below.

> **CRITICAL FOR WORKING IMAGES:** Do not type manual folder paths. Edit this file directly on the GitHub web interface, click on the blank line below each prompt, and **paste (Ctrl+V / Cmd+V)** your screenshot. GitHub will automatically upload the file and generate a permanent, working image link for you.

### A. Milestones and Issues
*![Milestone Image](/evidence/milestones.png)*

* **Caption:** As shown in the image, the project workflow is structured across four distinct milestones that systematically build my recipe application from the ground up. 
I have already begun executing the technical foundation, with the "System Configuration & Firebase Initialization" milestone currently at 50% completion after successfully closing one of its setup issues. 
From there, the development will logically progress into data handling by first tackling "The Recipe Directory (Read Operations)" to fetch and render your cloud data onto a responsive CSS grid, followed immediately by the "Custom Recipe Builder (Write Operations)" to securely handle form submissions and Firestore uploads. 
Finally, the workflow wraps up with "Polish, bug fixes and deployment," where I will strategically consolidate the URL query routing alongside your GitHub Pages deployment and submission.md finalization, ensuring a clean, fully functional release.

### B. Project Board
*Provide a screenshot of your GitHub Project Board with your issues organized dynamically across columns (To Do, In Progress, Done).*

![Project Board Photo](/evidence/projectBoard.png)

* **Caption:** My project board demonstrates active task progression: my repository configuration is complete, my file architecture is currently in review, Firebase integration is actively in progress, and the remaining UI and data logic issues are queued in the To-do backlog.

### C. Branching Architecture
*Provide a screenshot showing your local or remote Git branch list, highlighting your use of conventional, issue-linked naming patterns (e.g., `feat/`, `fix/`, `style/`).*

![Branches Image](/evidence/branches.png)

* **Caption:** This remote branch list demonstrates strict adherence to conventional branching architecture, utilizing descriptive prefixes (feat/, fix/, chore/, style/, docs/) to clearly categorize the type of work being done. Furthermore, every branch systematically includes the corresponding issue number (e.g., feat/35-add-categories-page), ensuring perfect traceability between the codebase and the project management board.

### D. Pull Requests & Traceability
*Provide a screenshot of a completed or open Pull Request (PR) on GitHub that clearly shows it is linked to a related development issue.*

![PR Image](/evidence/pr.png)

* **Caption:** This open Pull Request implements the frontend form submission and Firestore database write logic, utilizing the Closes #8 keyword in the description to automatically link and resolve the "Build accessible recipe submission form" development issue upon merging.

---

## 5. Merge Conflict Evidence

You must engineer **three merge conflicts**, each triggered by a **different cause** from those covered in the lecture. For Conflict 1, document the full resolution lifecycle. For Conflicts 2 and 3, provide the conflict marker screenshot and identify the cause.

> **Marks:** Conflict 1 full chronology (2 marks) · Conflict 2 (1 mark) · Conflict 3 (1 mark) · All three use distinct causes (1 mark) = **5 marks total**

---

### Conflict 1 — Full Chronology

**What cause did you use?** Simultaneous Edits: Modifying the same lines of a file in two different branches 

#### Step 1: Generating the Clash
*Screenshot showing the merge attempt and the conflict warning.*

![Conflict 1 Image](/evidence/conflict_1.png)

* **Caption:** I attempted to merge the feat/6-fetch-firestore branch into the main branch, but received a conflict warning. The collision occurred because both branches contained overlapping edits to the assets/css/style.css file.

#### Step 2: Inside the Code Editor (Conflict Markers)
*Screenshot showing the raw, unresolved conflict markers (`<<<<<<< HEAD`, `=======`, `>>>>>>>`) in your editor.*

![Conflict Marker 1](/evidence/conflict_marker_1.png)

* **Caption:** The dispute was caused by a CSS naming collision. The feat/6-fetch-firestore branch attempted to introduce new layout features while renaming the classes (e.g., using .detail-hero), but the main branch retained the .recipe-detail naming convention. 

#### Step 3: Resolution & Clean Merge
*Screenshot of your clean Git history or completed PR showing the conflict was resolved and merged.*

![Clean Merge 1](/evidence/clean_merge_1.png)

* **Caption:** To resolve this, I manually removed the conflict markers and synthesized the code, keeping the new styling from the feature branch while strictly preserving the .recipe-detail class names from main to ensure the JavaScript DOM injection continues to function properly.

---

### Conflict 2 — Different Cause

**What cause did you use?** Add vs. Add Collision (Creating identical file paths independently)

**Why does this cause trigger a conflict?** This occurs when two distinct branches create a brand new file using the exact same filename and folder path. Because Git sees two completely different sets of history trying to initialize the exact same file, it halts the merge to let the developer decide whose content should be kept.

![Conflict_marker_2 image](/evidence/conflict_marker_2.png)

* **Caption:** The conflict markers in data.json demonstrate an "Add vs. Add" collision. The current branch and the incoming branch both independently initialized a new file with the exact same name but different JSON content, forcing a manual resolution.

---

### Conflict 3 — Different Cause

**What cause did you use?** Context Collision (Appending new lines at the exact same anchor point)

**Why does this cause trigger a conflict?** This occurs when two branches insert new code at the exact same contextual anchor (like appending it to the very bottom of a file), Git throws a conflict because it cannot safely determine whose new code should appear first.

![conflict_marker_3 Image](/evidence/conflict_marker_3.png)

* **Caption:** The conflict markers in styles-test.css highlight a context collision. Both branches appended entirely different CSS classes at the exact same anchor point (immediately below the base class). Git required manual intervention to stack them correctly.

---
##
## 6. Feedback & Evaluation

To help improve this course for future engineering cohorts, please take 2 minutes to fill out the anonymous feedback form. Your honest review helps shape how this program is taught next semester!
- [ ] **Anonymous Evaluation Form:** [Course & Instructor Evaluation](https://forms.gle/YLybnsyXXErKEg3s9)

---
 
## Final Submission
 
Once your repository is complete, submit your work through the official submission form below. The form will **stop accepting responses after Monday, August 17th, 2026** — no late submissions will be accepted.
 
> **Submission Form:** [https://forms.gle/KrT4VxtFtkU3wtYu8](https://forms.gle/KrT4VxtFtkU3wtYu8)