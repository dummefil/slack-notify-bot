function buildPullrequestSection(pullrequest, slackUsers) {
  const { source: { repository }, reviewers } = pullrequest;
  const mappedReviewers = mapReviewers(reviewers);
  return [{
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": "Hey, you guys need to clean up this mess!"
    },
    "accessory": {
      "type": "button",
      "text": {
        "type": "plain_text",
        "text": "Take a mop! 🧹",
        "emoji": true
      },
      "value": "Link to pullrequest",
      "url": `${pullrequest.links.html.href}`,
      "action_id": "button-action"
    }
  },
    {
      "type": "divider"
    },
    {
      "type": "section",
      "text": {
        "type": "plain_text",
        "text": `Repository: ${repository.name}#${pullrequest.id} by ${pullrequest.author.display_name} at ${pullrequest.created_on}`,
      }
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": `Cleaners: ${mappedReviewers}`
      }
    },
    {
      "type": "divider"
    }]
}

function mapReviewers(reviewers) {
  return reviewers.map((reviewer) => {
    return `@${reviewer.display_name}`
  }).join(', ')
}

module.exports = { buildPullrequestSection };
