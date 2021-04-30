const { WebClient, ErrorCode }  = require('@slack/web-api');

const { buildRepositoriesSection } = require('./slackBlocks/repositorySection');
const { buildPullrequestSection } = require('./slackBlocks/pullrequestSection');
const { getRepositories, getPullRequests } = require('./bitbucket');
const { slack } = require('./settings');

const slackClient = new WebClient(slack.token);

function send(blocks) {
  return slackClient.chat.postMessage({
    channel: slack.channel,
    blocks,
  })
}

async function sendRepositoryMessage() {
  const repositories = await getRepositories()
  const blocks = buildRepositoriesSection(repositories);
  return send(blocks);
}

async function getSlackRealUsers() {
  const users = await slackClient.users.list();
  return users.members.filter((user) => user.is_bot === false);
}

async function pullrequestMessage() {
  const pullrequests = await getPullRequests();
  const slackUsers = await getSlackRealUsers();
  for (let i = 0; i < pullrequests.length; i++) {
    const pullrequest = pullrequests[i];
    const blocks = buildPullrequestSection(pullrequest, slackUsers);
    await send(blocks);
  }
}

(async () => {
  try {
    await pullrequestMessage()
  } catch (error) {
    if (error.code === ErrorCode.PlatformError) {
      console.log(error.data);
    } else {
      console.error(error);
      console.log('Well, that was unexpected.');
    }
  }
})();
