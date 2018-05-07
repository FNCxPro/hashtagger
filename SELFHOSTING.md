# Selfhosting
To be honest: you shouldn't do this.  
There may be hardcoded bits that may screw up your ability to update from the repository later if you were to change them (we try to avoid those!)  
However, if you want to proceed, go ahead.  
Sidenote: use [yarn](https://yarnpkg.com).  
1. Run `git clone https://github.com/FNCxPro/hashtagger.git`
2. Run `cd hashtagger`
3. Run `yarn install`
4. Copy `config/default.json` to `config/production.json` and change the necessary configuration fields.
5. Run `yarn run create`
6. Run `yarn run migrate`
7. Run `yarn start`

The bot *should* be running. We don't explicitly make changes to support selfhosting, but open an issue anyway if you are sure this is a problem in the codebase and not one introduced from your selfhosting environment.