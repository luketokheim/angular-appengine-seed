from endpoints_proto_datastore.ndb import EndpointsModel
from google.appengine.ext import ndb

class Model(EndpointsModel):
    # For EndpointModel, define which properties are published in the
    # translation to and from protorpc messages.
    _message_fields_schema = ("id", "name", "description", "created")

    name = ndb.StringProperty()
    description = ndb.StringProperty(indexed=False)

    created = ndb.DateTimeProperty(auto_now_add=True)