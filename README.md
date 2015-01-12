# git-execute
Execute scripts when various file types have been updated in GIT. Specifically this script is used at Beanstalk within a git hook to conditionally run `npm install` and a gulp build when frontend files have changed.

## Example configuration within `package.json`
Install with `npm install -g js-tasker`

By default, git-tasker will execute `git diff --name-only HEAD@{1} HEAD` to determine which files have changed. Each file is matched against a `matcher` within the below json. If it matches, the command will be queued for execution. Duplicate commands will only be queued once and are queued in the order they are defined. In the below example, the `npm install` command will always be executed before the `gulp build`.
```json
{
  "name": "example",
  "dependencies": [],
  "git-tasker": [
    {
      "matcher": "package.json",
      "command": "npm install"
    },
    {
      "matcher": "**/*.js",
      "command": "gulp build"
    }
  ]
}
```

## API Usage
Install with `npm install js-tasker`
```javascript
var js_tasker = require('js-tasker');
/**
 * @param config - a configuration array, same as the above config in package.json
 * @param git_list_command - optional string command for listing files changed. Defaults to `git diff --name-only HEAD@{1} HEAD`
 * @param callback - A final callback when all tasks/commands have been executed
 */
js_tasker(config, git_list_command, callback);
```
