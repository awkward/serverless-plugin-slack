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
      const config = { service: { custom: { slack: { user: 'jd', webhook_url: 'https://example.com' } } } };
      const options = { functionObj: { handler: 'foo', name: 'bar' }, stage: 'stage' };

      const plugin = new SlackServerlessPlugin(config, options);

      plugin.sendWebhook = jest.fn();

      plugin.afterDeployFunction();

      expect(plugin.sendWebhook).toHaveBeenCalledWith({
        body: '{"text":"jd deployed handler foo (bar) to environment stage"}',
        headers: { 'Content-type': 'application/json' },
        method: 'POST',
        url: 'https://example.com',
      });
    });
  });
});
