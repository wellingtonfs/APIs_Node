from requests_html import HTMLSession # type: ignore
from bs4 import BeautifulSoup # type: ignore

import time

ini = time.time()

session = HTMLSession()

response = session.get("https://www.youtube.com/results?search_query=Imagine+dragons+-+Natural")
response.html.render(sleep=3)

soup = BeautifulSoup(response.html.html, "lxml")

res = list(map(lambda x: [x['title'], x['href']], soup.select('ytd-video-renderer #video-title')))
print(res)

print("\n levou %.2f segundos" %(time.time() - ini))