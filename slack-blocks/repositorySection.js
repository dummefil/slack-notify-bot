function buildRepositoriesSection(repositories) {
  const slugsToString = repositories.map((rep) => rep.slug + ` (${rep.branches.length})`).join('\n');
  return [
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": `*Repositories*`
      },
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": slugsToString
      },
    }
  ]

}

module.exports = { buildRepositoriesSection };
