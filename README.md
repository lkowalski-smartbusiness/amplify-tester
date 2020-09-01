# AmplifyTester

Project created from a regular Angular CLI (10.0.6) stub in order to test the stability and basic functions of latest Amplify UI Angular package

## What to look for

*onAuthUIStateChange* in *AppComponent.ngOnInit* has a fix described, that resolves most of the issues with forcing Change Detection after user AuthStatus changes

## Noticed issues
* You receive an exception after logout:

        zone-evergreen.js:659 Unhandled Promise rejection: not authenticated ; Zone: <root> ; Task: Promise.then ; Value: not authenticated undefined
* *Back to Sign In* button in *Reset password* state is not wrapped in a span. Amplify.I18n fails to notice it when we input a different vocabulary
* Login screen does not support Chrome's credential saving/password suggestion
