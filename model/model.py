from endpoints_proto_datastore.ndb import EndpointsModel
from google.appengine.ext import ndb

class Model(EndpointsModel):
    _message_fields_schema = ("id", "name", "description", "created")

    name = ndb.StringProperty()
    description = ndb.StringProperty(indexed=False)

    created = ndb.DateTimeProperty(auto_now_add=True)