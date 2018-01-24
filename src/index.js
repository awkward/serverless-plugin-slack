const request = require('request');

function parseMessage(message, messageVariables) {
  return Object.entries(messageVariables).reduce((parsedMessage, [key, value]) => parsedMessage.replace(new RegExp(`{{${key}}}`, 'g'), value), message);
}

class SlackServerlessPlugin {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;

    if (!this.serverless.service.custom.slack) { throw new Error('No Slack options set in config'); }

    if (!this.serverless.service.custom.slack.webhook_url) { throw new Error('No Slack webhook url set in config'); }

    this.webhook_url = this.serverless.service.custom.slack.webhook_url;

    this.messageVariables = {
      user: this.serverless.service.custom.slack.user || process.env.USER,
      handler: options.functionObj.handler,
      name: options.functionObj.name,
      stage: options.stage,
    };

    this.hooks = {
      'after:deploy:function:deploy': this.afterDeployFunction.bind(this),
    };
  }

  afterDeployFunction() {
    const message = this.serverless.service.custom.slack.function_deploy_message ||
            '{{user}} deployed handler {{handler}} ({{name}}) to environment {{stage}}';

    const parsedMessage = parseMessage(message, this.messageVariables);

    return this.sendWebhook(this.buildRequestOptions(this.webhook_url, parsedMessage));
  }

  buildRequestOptions(url, message) {
    return {
      url,
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ text: message }),
    };
  }
  sendWebhook(options) {
    return new Promise((resolve, reject) => {
      request(options, (error, response) => {
        if (!error && response.statusCode == 200) return reject(err);
        return resolve(response);
      });
    });
  }
}

module.exports = SlackServerlessPlugin;
