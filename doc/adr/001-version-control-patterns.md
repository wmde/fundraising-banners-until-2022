# Version Control Patterns

2018-08-15

## Status

Accepted

## Context

A fundraising campaign at WMDE consists of a series of A/B tests of banners. We call the two versions of a banner CTRL ("control banner") and VAR ("variant banner").
The "winner" of one A/B test becomes the basis for the next test. There are different kinds of A/B tests:

1. **Text Tests** - Different texts in the text part of the banner
2. **Markup Tests** - Small design or UX changes (different type/number/order of form fields), introducing new elements (progress bar, link to application of funds page). These tests may also introduce new JavaScript code.
3. **Style Tests** - The Markup stays the same, but the styles are different.
4. **Design Tests** - Test different designs that need both style and markup changes. Some might even add JavaScript.
4. **Re-tests** - Test an older banner against the current winner (sometimes the old banner fares better). We might need to update the JavaScript

From a developer perspective, the evolution of the banners should be visible in the version history of the project. To get a better overview of the evolution, we need some conventions around our commits, branches and tags. The conventions should support the following situations:

* We are doing a code review for a new banner. We want to be able to see on a commit level how the CTRL version of the banners differs from VAR.
* We want to look at an older version of a banner. We need to find the exact version that we deployed.
* We want to know what banners we have deployed, and which un-deployed banners we are working on and what the difference is between them.
* We want to re-test an older banner and need to figure out what improvements of the shared code need to be "back-ported".

While developing banners, we also have a second goal: We want to reuse as much code as possible between CTRL and VAR.

## Decision

### Branches
* The `master` branch should contain the banners we have deployed on CentralNotice and the wikipedia.de.
* To develop new banners, we create a feature branch. We merge the feature branches **after** we deployed them to CentralNotice/wikipedia.de.
Branch names follow the pattern `C<year>_<environment>_<campaign_number>`. `<year>` is the two-digit year number,
`<environment>` is the environment that displays the banner (`desktop`, `mobile`, `tablet`, `english`, `wpde`).
`<campaign_number>` is a zero-padded 2-digit number counting up for each A/B test on a platform.
* It should be the [same number used in CentralNotice][1].

We generally try to avoid changes to the master branch after we merged commits, but if we inadvertently merge/commit something to master we allow amends of  minor changes if all team members agree and are aware of this change.

### Commits
* Each feature branch should have two commits, the **Setup/Reset commit** and the **A/B test commit**. When we need to improve upon the winning banner from a previous test, we commit those changes in a separate **Improve commit** after the Setup commit.
* The reviewer of the branch checks if the committer followed the recommendations for the commit contents and format.
* From time to time we check if the instructions in this document still match our banner architecture and update the instructions accordingly.

#### First commit - Setup/Reset
The goal of the first commit is to set up two identical banners which share as much code as possible, taking the "winner" banner from a previous A/B test as a base.

Expected file structure:

|File|Contents|Only for specific tests|
|---|---|---|
|`banner_ctrl.js` |code from winning banner | |
|`banner_var.js` |code from winning banner | |
|`templates/application_of_funds.hbs`|always the same| |
|`templates/banner_html.hbs`|Markup from winning banner| |
|`templates/banner_html_var.hbs`|Markup from winning banner|Design |
|`templates/banner_text.hbs`|Text contents markup from winning banner| |
|`templates/banner_text_var.hbs`|Text contents markup from winning banner|Text |
|`css/styles.pcss`|CSS from winning banner| |
|`css/icons.css`|always the same| |
|`css/wlightbox.css`|always the same| |

We delete all files that don't match the structure above or are not for the specific test type.

We also change `campaign_info.toml`, adjusting banner and campaign names as part of the setup commit.

The first commit message should have the following format:
```
Prepare Campaign <CAMPAIGN_NAME>

Resetting CTRL to (CTRL or VAR from <OLD_CAMPAIGN_NAME>)
```

[See setup instruction for campaign names][1].

#### Improve Commit (optional)
If we need to improve the shared code of the banners, we do it in a separate commit. We describe our improvements in the commit message.

#### Second Commit - A/B test
The second commit should only touch the necessary changes in `banner_var.js`, `templates/banner_html_var.hbs`, `styles_var.pcss` `templates/banner_text_var.hbs`, depending on the type of A/B test.

The second commit message should have the following format:
```
Prepare VAR banner for <CAMPAIGN_NAME>

Description of the difference between banners here.

Full URL to Phabricator ticket  
```

If we need to change the CTRL banner during review, we do an interactive rebase and edit the first commit of the branch.
If we need to change the VAR banner during review, we amend the second commit of the branch.

If an A/B test contains a sequence of banners, the recommendations still apply and we adjust the file names as needed.

### Tags
After we merged a branch into master, we create a tag with the [campaign name][1].

If we deploy a hotfix to a banner without starting a new A/B test, we tag the new commit id in master with the campaign name plus `-fixed` suffix.

## Consequences

* Developers will have an easier time finding banners from old campaigns.
* Developers are able to selectively copy files from old campaigns with `git checkout CAMPAIGN_NAME -- path/to/file`
* Developers can compare the differences between A/B versions of a banner on the commit level, they don't have to use `diff` on the command line.
* We can use commit message templates to produce consistent commit messages (e.g. `git commit -a -t .first_commit.txt`).
  In a more fancy version, we could [use the `prepare-commit-msg` hook](https://git-scm.com/docs/githooks#_prepare_commit_msg)
  to determine the campaign name based on branch name and `campaign_info.toml` and replace the placeholder in the commit
  message template.
* We can experiment with scripting to set up the first commit of a branch to a certain extent.

[1]: https://github.com/wmde/fundraising-infrastructure/wiki/How-to-manage-banners-on-de.wikipedia.org#campaign-names.
