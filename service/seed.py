import endpoints
from google.appengine.ext import ndb
from protorpc import remote

from model.model import Model

@endpoints.api(name="seed", version="v1", description="Seed API",
               allowed_client_ids=[endpoints.API_EXPLORER_CLIENT_ID])
class Api(remote.Service):
    @Model.method(path="model", http_method="POST", name="model.create")
    def model_create(self, model):
        if model.from_datastore:
            raise endpoints.BadRequestException()

        model.put()
        return model

    @Model.method(path="model/{id}", http_method="GET", name="model.read")
    def model_read(self, model):
        self._authorize_model(model)

        return model

    @Model.method(path="model/{id}", http_method="POST", name="model.update")
    def model_update(self, model):
        self._authorize_model(model)

        model.put()
        return model

    @Model.method(path="model/{id}", http_method="DELETE", name="model.delete")
    def model_delete(self, model):
        self._authorize_model(model)
    
        model.key.delete()
        return Model(id=model.id)

    @Model.query_method(path="model", http_method="GET", name="model.query",
                        query_fields=("name", "limit", "order", "pageToken"),
                        limit_default=5, limit_max=50)
    def model_query(self, query):
        return query.order(-Model.created)

    @classmethod
    def _authorize_model(cls, model):
        if not model.from_datastore:
            raise endpoints.NotFoundException()

        return model