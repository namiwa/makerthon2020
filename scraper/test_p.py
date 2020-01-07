import requests
import re
from bs4 import BeautifulSoup

'''
Connect: Team-12 Makerthon 2020
Pulling community events from onepa.sg website, where the available data would be webscraped and parsed.
Would require further processing to suit our needs.
'''

def getHttpContent(url):
  res = requests.get(url)
  if res.status_code != 200:
    print res.status_code
    return None
  return res.content
  
def parseHtmlSoup(url):
  html = getHttpContent(url)
  if html == None:
    return
  parseHtml = BeautifulSoup(html, features="html.parser")
  store = []
  for a in parseHtml.find_all('a', href=True):
    store.append(a['href'])
    print a['href']
  print store
  #print re.sub('\s\s+', ' ', navString)


if __name__ == '__main__':
  url1 = 'https://www.onepa.sg/'
  google = 'https://www.google.com/'
  giving = 'https://www.giving.sg/'
  parseHtmlSoup(giving)