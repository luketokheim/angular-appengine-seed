from google.appengine.ext import ndb
from endpoints_proto_datastore.ndb import EndpointsModel
from protorpc import messages

class Model(EndpointsModel):
    _message_fields_schema = ("id", "name", "description", "created")

    name = ndb.StringProperty()
    description = ndb.StringProperty()

    created = ndb.DateTimeProperty(auto_now_add=True)

class SearchRequestMessage(messages.Message):
    q = messages.StringField(1, required=True)