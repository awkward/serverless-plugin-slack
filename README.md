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
    function_deploy_message: optional message, defaults to "{{user}} deployed function ({{name}}) to environment {{stage}} in service {{service}}"

```

