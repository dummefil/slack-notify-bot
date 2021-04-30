const { SLACK_TOKEN, BITBUCKET_USER, BITBUCKET_PASS } = process.env;

module.exports = {
    slack: {
        token: SLACK_TOKEN,
        channel: 'utility-room',
    },
    bitbucket: {
        user: BITBUCKET_USER,
        password: BITBUCKET_PASS,
    }
}