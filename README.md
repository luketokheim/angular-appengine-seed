angular-appengine-seed
======================

Sample application for using AngularJS backed with a Cloud Endpoint on Google
App Engine.

## Live Version

https://angular-seed.appspot.com

## Directory Layout

- lib/: Python library files not included in the standard runtime environment.
- model/: Python NDB class definitions. NDB is the schemaless object datastore
  on the App Engine.
- service/: Python Cloud Endpoints definitions. Defines the API backend classes.
- static/: Client side HTML, JavaScript, and other static files. The files in
  this folder are similar in layout to the Angular Seed application.
- app.yaml: App Engine configuration file. Defines paths and Python handlers.
- fix_path.py: Python file to set up our standard project include path.
- services.py: Python handler for the Cloud Endpoints. Choose which API service
  classes are active.
