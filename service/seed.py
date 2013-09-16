from google.appengine.api import search
from google.appengine.ext import endpoints
from google.appengine.ext import ndb
from protorpc import remote
from datetime import datetime

from model.model import Model, SearchRequestMessage

import logging
from protorpc import message_types

@endpoints.api(name="seed", version="v1", description="Seed API",
               allowed_client_ids=[endpoints.API_EXPLORER_CLIENT_ID])
class Api(remote.Service):
    SEARCH_INDEX = "Model"

    @Model.method(path="model", http_method="POST", name="create")
    def model_create(self, model):
        if model.from_datastore:
            raise endpoints.BadRequestException()

        self._put_model(model)
        return model

    @Model.method(path="model/{id}", http_method="GET", name="read")
    def model_read(self, model):
        self._authorize_model(model)

        return model

    @Model.method(path="model/{id}", http_method="POST", name="update")
    def model_update(self, model):
        self._authorize_model(model)

        self._put_model(model)
        return model

    @Model.method(path="model/{id}", http_method="DELETE", name="delete")
    def model_delete(self, model):
        self._authorize_model(model)
    
        model.key.delete()
        return Model(id=model.id)

    @Model.query_method(path="model", http_method="GET", name="query",
                        query_fields=("name",),
                        limit_default=5, limit_max=50)
    def model_query(self, query):
        return query.filter(
            Model.created < datetime.now()).order(-Model.created)

    @Model.method(request_fields=("name",),
                  response_message=Model.ProtoCollection(),
                  http_method="GET", name="search", path="search")
    def model_search(self, model):
        items = []

        if model.name:
            index = search.Index(name=self.SEARCH_INDEX)
            result = index.search("name:%s" % model.name)
            for document in result.results:
                obj = {
                    "id": int(document.doc_id)
                }
                for field in document.fields:
                    obj[field.name] = field.value
                items.append(Model(**obj))

        return Model.ToMessageCollection(items)

    @classmethod
    def _authorize_model(cls, model):
        if not model.from_datastore:
            raise endpoints.NotFoundException()

        return model

    @classmethod
    def _put_model(cls, model):
        model.put()
        if cls.SEARCH_INDEX:
            cls._put_index(model)

    @classmethod
    def _delete_model(cls, model):
        model.key.delete()
        if cls.SEARCH_INDEX:
            cls._delete_index(model)

    @classmethod
    def _put_index(cls, model):
        document = search.Document(
            doc_id=str(model.key.id()),
            fields=[
                search.TextField(name="name", value=model.name),
                search.DateField(name="created", value=model.created)
            ])

        try:
            index = search.Index(name=cls.SEARCH_INDEX)
            index.put(document)
        except search.Error, e:
            logging.error(e)

    @classmethod
    def _delete_index(cls, model):
        try:
            index = search.Index(name=cls.SEARCH_INDEX)
            index.delete(str(model.key.id()))
        except search.Error, e:
            logging.error(e)