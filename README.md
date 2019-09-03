# Serverless Plugin Webpack

Notify slack webhook after running `sls deploy function`


## Install
Using npm:
```
npm install serverless-plugin-slack --save-dev
```

Add the plugin to your `serverless.yml` file:
```yaml
plugins:
  - serverless-plugin-slack
```

## Configuration

```yaml
custom:
  slack:
    webhook_url: https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX
    user: some_user (optional, defaults to user set in process.env.USER)
    emoji: custom slack emoji (optional, default :cloud:)
    function_deploy_message: optional message, defaults to "`{{user}}` deployed function (`{{name}}`) to environment `{{stage}}` in service `{{service}}`"
    service_deploy_message: optional message, defaults to "`{{user}}` deployed service `{{service}}` to environment `{{stage}}`"

```

In the messages the following variables are available:
 * {{user}}
 * {{service}}
 * {{name}} - function name, only when deploying single function
 * {{stage}}