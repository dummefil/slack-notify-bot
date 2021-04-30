const qs = require('qs');
const { requestWithBearerToken, request } = require('./request');
const { bitbucket } = require('./settings');

const base = 'https://api.bitbucket.org';

let token;

async function getAccessToken() {
  const url = 'https://bitbucket.org/site/oauth2/access_token'
  const requestConfig = {
    method: 'POST',
    auth: {
      username: bitbucket.user,
      password: bitbucket.password
    },
    data: qs.stringify({ grant_type: 'client_credentials' }),
  }
  const response = await request(url, requestConfig);
  return {
    ttl: response.expires_in + getEpochDate(),
    token: response.access_token,
  }
}

function getEpochDate() {
  return Math.round(Date.now() / 1000)
}

async function makeRequest(url) {
  if (!token || token.ttl < getEpochDate()) {
    token = await getAccessToken();
  }
  return requestWithBearerToken({ url, token });
}

async function getRepositories() {
  const url = base + '/2.0/teams/kealabs/repositories';
  const repositories = await makeRequest(url);
  for (const repository of repositories) {
    repository.branches = await makeRequest(repository.links.branches.href);
  }
  return repositories;
}

async function getFormattedBranches() {
  const repositories = await getRepositories();
  for (const repository of repositories) {
    const { branches } = repository;
    console.log();
    console.log('Branches for', repository.slug, `(${branches.length})`)
    branches.forEach((branch) => {
      console.log('\t' + branch.name);
    })
  }
}

async function getPullRequests() {
  const repositories = await getRepositories();
  const pullRequests = [];
  for (const repository of repositories) {
    const pullrequests = await makeRequest(repository.links.pullrequests.href);
    for (const prObject of pullrequests) {
      const pullRequest = await makeRequest(prObject.links.self.href);
      pullRequests.push(pullRequest);
    }
  }
  return pullRequests;
}

module.exports = {
  getPullRequests,
  getFormattedBranches,
  getRepositories,
}
