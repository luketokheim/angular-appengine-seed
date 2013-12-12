import fix_path
import endpoints

from service import seed

app = endpoints.api_server([seed.Api], restricted=False)