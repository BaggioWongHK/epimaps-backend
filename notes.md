<style>
img { width: 100px; height: 100px }
.project-logo { margin: auto; text-align: center }
</style>

<div class="project-logo">
    <img src="/images/project-logo.png" />
</div>

# Latest changes

- JSON.stringify (or else front end complains)

# Tasks left to do

- A few more APIs to add
 - Clean up text in extracted data (get rid of whitespace and unnecessary symbols)
 - Need to fix - trends should only return items with Wikipedia articles 
- Clean up tests if time allows

# Others

To reference if you want: http://wiki.polyfra.me/#

# APIs of interest

To get page summary, you can do this: 

- Get an article's pageid

https://en.wikipedia.org/w/api.php?action=parse&page=Nicolas_Cage&prop=revid

Returns

```json
{
    "parse": {
        "title": string,
        "pageid": number,
        "revid": number
    }
} 
```

- Get a plaintext summary of a page 

https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=Nicolas%20Cage

Returns 

````json
{
    query: {
        pages: {
            [pageid]: {
                extract: string, // interested in this
                ns: number,
                pageid: number,
                title: string
            }
        }
    }
}
````

- Get an array of images used on a Wikipedia page

https://en.wikipedia.org/w/api.php?action=query&titles=Al-Farabi&prop=images&format=json

````json
{
    query: {
        pages: {
            [pageid]: {
                images: [
                    {
                        ns: number,
                        title: string
                    }
                ]
            }
        }
    }
}
````

- Get the image file URL in Wikimedia commons

https://en.wikipedia.org/w/api.php?action=query&titles=File:Bodlein_Library_MS._Arab.d.84_roll332_frame1.jpg&prop=imageinfo&iiprop=url

````json
{
    query: {
        pages: {
            "-1": {
                imageinfo: [
                    {
                        url: string
                    }
                ]
            }
        }
    }
} 
````

- Get the page thumbnail

https://en.wikipedia.org/w/api.php?action=query&titles=Al-Farabi&prop=pageimages&format=json

````json
{
    query: {
        pages: {
            [pageid]: {
                thumbnail: {
                    source: string
                }
            }
        }
    }
}
````

- Checking if a Wikipedia page exists is trivial

Just do a normal AJAX request and check if the return code is 404. 
For example, jQuery's ajax success and fail callbacks take this function

````javascript
function(jqXHR, textStatus, errorThrown)
````

We're mostly interested in jqXHR

````json
{
    status: number
}
````

The HTTP status codes we're interested in
- 200 OK
- 400 Bad Request

````javascript
$.get("https://en.wikipedia.org/wiki/Fod").fail(function(jqXHR, textStatus, errorThrown) {
   console.log(jqXHR.status);
});
````

## Reference

- Grab article summary 

https://stackoverflow.com/questions/24806962/get-an-article-summary-from-the-mediawiki-api

- Grab plaintext article summary

https://stackoverflow.com/questions/8555320/is-there-a-clean-wikipedia-api-just-for-retrieve-content-summary

- Wikipedia's most used API (Query)

https://en.wikipedia.org/w/api.php?action=help&modules=query (prop)

- Get pictures of a Wikipedia article

https://stackoverflow.com/questions/8363531/accessing-main-picture-of-wikipedia-page-by-api

- Check for article existence

https://stackoverflow.com/questions/31606676/python-check-if-wikipedia-article-exists

- Integrating Angular into MEAN stack (very clean tutorial)

https://coursetro.com/posts/code/84/Setting-up-an-Angular-4-MEAN-Stack-(Tutorial) (clean tutorial)

- Angular 4 in MEAN (a bit more convoluted)

https://medium.com/netscape/mean-app-tutorial-with-angular-4-part-1-18691663ea96

- Follow redirects

https://stackoverflow.com/questions/16687618/how-do-i-get-the-redirected-url-from-the-nodejs-request-module

https://github.com/request/request/issues/832

https://github.com/request/request

- Fixing CORS issue

https://stackoverflow.com/questions/18310394/no-access-control-allow-origin-node-apache-port-issue

- HTTPErrorResponse SyntaxError: Unexpected token h in JSON at position 0 at JSON.parse angular 4

https://github.com/angular/angular/issues/18396

https://stackoverflow.com/questions/37948990/syntaxerror-unexpected-token-in-json-at-position-0-at-object-parse-native

https://stackoverflow.com/questions/47190620/angular-2-syntaxerror-unexpected-token-in-json-at-position-0-at-json-parse

For some reason, the response has to be JSON. 