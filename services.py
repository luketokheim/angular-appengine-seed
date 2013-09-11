import fix_path
from google.appengine.ext import endpoints

from service import seed

app = endpoints.api_server([seed.Api], restricted=False)