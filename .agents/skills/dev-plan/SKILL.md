---
name: "dev-plan"
description: "Turn what has been discussed or agreed on in the current conversation into a structured plan document (Context, Objectives, Requirements, Constraints, Expected Output, Next Step Suggestions), written in simple beginner-level English, saved as a markdown file. Use ONLY when the user explicitly invokes /dev-plan by name — never trigger automatically just because someone says \"make a plan\" or similar in normal chat."
---

# dev-plan

This skill turns the current conversation into a clear, structured plan document. It only runs when the user explicitly calls `/dev-plan` — never automatically.

## Why this format

The user wants a plan that is accurate, not padded and not too thin. Full sentences are used where something needs to be clear and cannot be misunderstood (Context, Expected Output). Short lists are used where a list is the natural, precise way to say something (Objectives, Requirements, Constraints, Next Step Suggestions). Everything is written in simple, beginner-level English — no jargon, no complex words when an easy one works just as well. This matters because the point of the plan is that anyone can read it and understand it right away, not to sound impressive.

## Steps

1. **Read back through the conversation.** Find what was actually discussed and agreed on: what is being built or done, why it matters, what it needs to include, what limits exist, and what the finished result should look like. Do not invent details that were not discussed.

2. **Write the plan using exactly these six sections, in this order:**
   - **Context** — what was discussed and why it matters. Full sentences, simple English.
   - **Objectives** — what the plan is trying to reach. Short bullet list, one idea per bullet.
   - **Requirements** — what must be included for the plan to succeed. Short bullet list.
   - **Constraints** — limits or boundaries the plan has to work inside (time, tools, scope, etc.). Short bullet list.
   - **Expected Output** — what the finished result should look like when it's done. Full sentences, simple English.
   - **Next Step Suggestions** — a short numbered list of a few possible first actions to get started. Frame these as suggestions, not commands or orders, since the real next step may change once work begins.

3. **Check each section has enough detail before writing it.** If the conversation does not give enough detail to confidently fill in one particular section, do not guess and do not leave it vague. Stop and ask the user one short, specific question about just that missing section (not the whole plan), then continue once they answer. Sections that do have enough detail should not be held up waiting on this.

4. **Use simple, beginner-level English throughout the whole document.** Avoid jargon and difficult words. If a plain, everyday word says the same thing, use that instead.

5. **Pick a file name based on the plan's topic**, not a generic name. For example, a plan about adding bidding notifications becomes `plan-bidding-notifications.md`, not `plan.md`.

6. **Ask the user where they want the file saved** before writing it. Do not assume a default location — always ask.

7. **Write the plan as a single, self-contained markdown (.md) file** with the six sections above, using the file name and location the user gave.

## Example output

```markdown
## Plan: Bidding Notifications for AgriBidaSystem

**Context**
Right now, farmers cannot tell when someone bids on their listing. They have to check the app by hand. We talked about this and agreed it is a problem, because farmers may not open the app often.

**Objectives**
- Let farmers know right away when a new bid comes in.
- Keep it simple to build, since this is a frontend-only school project.

**Requirements**
- Show a badge or alert when a new bid happens.
- The alert must show the listing name and the bid amount.
- It must work with the bid data the app already has.

**Constraints**
- No backend. Everything must work using data already in the app (frontend only).
- Must be done within the school project deadline.
- Should not need big changes to the current app design.

**Expected Output**
A working notification feature in AgriBidaSystem. It should be ready to show during the project presentation.

**Next Step Suggestions**
1. Add a badge icon to the listing card.
2. Connect the badge to the bid data.
3. Test it using a fake bid.
```