/* eslint-disable no-undef */
const SlackServerlessPlugin = require('../index');

describe('serverless plugin slack', () => {
  test('it fails on absent config ', () => {
    const config = { service: { custom: {} } };

    expect(() => { new SlackServerlessPlugin(config); }).toThrow('No Slack options set in config');
  });

  test('it fails on absent webhook url ', () => {
    const config = { service: { custom: { slack: {} } } };

    expect(() => { new SlackServerlessPlugin(config); }).toThrow('No Slack webhook url set in config');
  });

  describe('single function deployment', () => {
    test('it sends message', () => {
      const config = { service: { service: 'foobar', custom: { slack: { user: 'jd', webhook_url: 'https://example.com' } } } };
      const options = { f: 'bar', stage: 'staging' };

      const plugin = new SlackServerlessPlugin(config, options);

      SlackServerlessPlugin.sendWebhook = jest.fn();

      plugin.afterDeployFunction();

      expect(SlackServerlessPlugin.sendWebhook).toHaveBeenCalledWith({
        body: '{\"text\":\"`jd` deployed function `bar` to environment `staging` in service `foobar`\",\"username\":\"jd\",\"icon_emoji\":\":cloud:\"}',
        headers: { 'Content-type': 'application/json' },
        method: 'POST',
        url: 'https://example.com',
      });
    });
  });

  describe('service deployment', () => {
    test('it sends message', () => {
      const config = { service: { service: 'foobar', custom: { slack: { user: 'jd', webhook_url: 'https://example.com' } } } };
      const options = { f: 'bar', stage: 'staging' };

      const plugin = new SlackServerlessPlugin(config, options);

      SlackServerlessPlugin.sendWebhook = jest.fn();

      plugin.afterDeployService();

      expect(SlackServerlessPlugin.sendWebhook).toHaveBeenCalledWith({
        body: '{\"text\":\"`jd` deployed service `foobar` to environment `staging`\",\"username\":\"jd\",\"icon_emoji\":\":cloud:\"}',
        headers: { 'Content-type': 'application/json' },
        method: 'POST',
        url: 'https://example.com',
      });
    });
  });

  describe('default parameters properly', () => {
    test('it sends message', () => {
      const config = { service: { service: 'foobar', custom: { slack: { user: 'jd', webhook_url: 'https://example.com' } } } };
      const options = { f: 'bar' };

      const plugin = new SlackServerlessPlugin(config, options);

      SlackServerlessPlugin.sendWebhook = jest.fn();

      plugin.afterDeployService();

      expect(SlackServerlessPlugin.sendWebhook).toHaveBeenCalledWith({
        body: '{\"text\":\"`jd` deployed service `foobar` to environment `dev`\",\"username\":\"jd\",\"icon_emoji\":\":cloud:\"}',
        headers: { 'Content-type': 'application/json' },
        method: 'POST',
        url: 'https://example.com',
      });
    });
  });
});
