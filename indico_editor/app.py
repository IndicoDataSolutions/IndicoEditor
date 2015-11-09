import uuid
import os
import os.path
from os.path import abspath, dirname
import json

from concurrent.futures import ThreadPoolExecutor
import tornado.ioloop
import tornado.web
import indicoio

from .categories import MAPPING

EXECUTOR = ThreadPoolExecutor(max_workers=2)

def aggregate_score(scores, category):
    subcategories = MAPPING.get(category)
    return sum([
        score for category, score in scores.items() 
        if category in subcategories
    ])

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.render('index.html')

    def post(self):

        data = json.loads(self.request.body)
        api = data.get('api')
        data = data.get('data')

        if api == 'sentiment':
            result = indicoio.sentiment(data)
        else:
            result = [aggregate_score(scores, api) for scores in indicoio.text_tags(data)]

        self.write(json.dumps(result))
        self.finish()

application = tornado.web.Application(
    [(r"/", MainHandler),],
    template_path=abspath(os.path.join(__file__, "../../templates")),
    static_path=abspath(os.path.join(__file__, "../../static"))
)

if __name__ == "__main__":
    application.listen(8001)
    tornado.ioloop.IOLoop.current().start()
