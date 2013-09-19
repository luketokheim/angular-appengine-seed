from endpoints_proto_datastore.ndb import EndpointsModel
from google.appengine.api import search
from google.appengine.ext import ndb

class SearchQuery(ndb.Query):
    def fetch_page(self, page_size, **q_options):
        #for f in self.filters:
        return super(SearchQuery, self).fetch_page(page_size, **q_options)

# @Model.method(response_message=Model.ProtoCollection(),
#               request_fields=("name",),
#               path="search", http_method="GET", name="search")
# def model_search(self, model):
#     items = []

#     if model.name:
#         result = self._index().search("name:%s" % model.name)

#         items = [Model.FromDocument(document)
#                  for document in result.results]

#     return Model.ToMessageCollection(items)

class SearchModel(ndb.Model):
    INDEX_NAME = None

    def put(self):
        super(SearchModel, self).put()
        if self.INDEX_NAME:
            self._index().put(self.to_document())

    def delete(self):
        super(SearchModel, self).delete()
        if self.INDEX_NAME:
            self._index().delete(self.key.urlsafe())

    def query(self, *args, **kwargs):
        return SearchQuery(kind=self.__class__.__name__, *args, **kwargs)

    def to_document(self):
        fields = []
        for name, prop in self._properties.iteritems():
            if not prop._indexed:
                continue

            value = getattr(self, name, prop._default)
            if isinstance(prop, ndb.StringProperty):
                fields.append(search.TextField(name=name, value=value))
            #elif isinstance(prop, ndb.DateTimeProperty):
            #    fields.append(search.DateField(name=name, value=value))

        return search.Document(doc_id=self.key.urlsafe(), fields=fields)

    @classmethod
    def FromDocument(cls, document):
        obj = {
            "id": ndb.Key(urlsafe=document.doc_id).integer_id()
        }

        for field in document.fields:
            obj[field.name] = field.value

        return cls(**obj)

    @classmethod
    def _index(cls):
        return search.Index(name=cls.INDEX_NAME)