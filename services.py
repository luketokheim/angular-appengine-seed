import fix_path
import endpoints
from google.appengine.ext.appstats import recording

from service import seed

app = endpoints.api_server([seed.Api], restricted=False)
app = recording.appstats_wsgi_middleware(app)