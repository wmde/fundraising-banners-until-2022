# Version Control Patterns

2018-07-06

## Status

Accepted

## Context

A fundraising campaign at WMDE consists of a series of A/B tests of banners. The two versions of a banner are called CTRL and VAR.
The "winner" of one A/B test becomes the basis for the next test. There are different kinds of A/B tests:

1. Different texts in the text part of the banner
2. Small design or UX changes (different type/number/order of form fields), introducing new elements (progress bar, link to application of funds page).
3. Different designs, from CSS color changes to banners with different markup and CSS.
4. Re-test an older concept against the current winner (sometimes the old concept fares better).

From a developer perspective, the evolution of the banners should be visible in the version history of the project. To get a better overview of the evolution, we need some conventions around our commits, branches and tags. The conventions should support the following situations:

* We are doing a code review for a new banner. We want to be able to see on a commit level how the CTRL version of the banners differs from VAR.
* We want to look at an older version of a banner. We need to find the exact version that we deployed.
* We want to know what banners are deployed, and which we are working on and what the difference is between them is.

## Decision


### Branches
The `master` branch should contain the banners we have deployed on CentralNotice and the wikipedia.de.
To develop new banners, we create a feature branch. We merge the feature branches **after** we deployed them to CentralNotice/wikipedia.de.
Branch names follow the pattern `C<year>_<environment>_<campaign_number>`. `<year>` is the two-digit year number,
`<environment>` is the environment that displays the banner (`desktop`, `mobile`, `tablet`, `english`, `wpde`).
`<campaign_number>` is a zero-padded 2-digit number counting up for each A/B test on a platform.
It should be the [same number used in CentralNotice][1].

If we inadvertently commit something to master, we generally try to avoid changes to the master branch but allow amends of very minor changes if all team members agree and are aware of this change.

### Commits
Each feature branch should have **two commits**.
The reviewer of the branch checks if the committer followed the recommendations for the commit contents and format.
From time to time we check if the instructions in this document still match our banner architecture and update the instructions accordingly.

#### First commit
The first commit should contain the following changes:
* Changes to `campaign_info.toml`, adjusting banner and campaign names.
* Deleting `styles_var.pcss`
* Copy the contents of the last "winning" banner into all ctrl and var files (`banner_xxx.js`, `templates/banner_html_xxx.hbs` and `css/styles_xxx.pcss`, [...]).
* Ensure the correct (_var / _ctrl) templates are referenced in the relevant JavaScript and template files
* If a banner requires general maintenance or improvements which are not subject to A/B testing, these changes must be implemented into both banners in the first commit

The first commit message should have the following format:
```
Prepare Campaign <CAMPAIGN_NAME>

Resetting CTRL to (CTRL or VAR from <OLD_CAMPAIGN_NAME>)
```

[See setup instruction for campaign names][1].

#### Second Commit
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
