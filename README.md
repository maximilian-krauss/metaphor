# metaphor

metaphor is a web service for aggregating and normalizing meta data of media content like youtube videos or soundcloud songs.

Supported platforms:
* Youtube
* Soundcloud
* Spotify (playlists)

## Configuration
Environment variable | Required | Default | Description
--- | --- | --- | ---
META_RESOLVER_SOUNDCLOUD_CLIENT_ID | yes | empty | Your Soundcloud Client Id.
META_RESOLVER_YOUTUBE_API_KEY | yes | empty | Your Youtube v3 API Key
META_RESOLVER_SPOTIFY_CLIENT_ID | yes | empty | Your Spotify client ID
META_RESOLVER_SPOTIFY_CLIENT_SECRET | yes | empty | Your Spotify client secret
META_REQUIRE_API_KEY | no | false | Set to true if the resolve route should be accessible via an API Key
META_API_KEY | yes, if `META_REQUIRE_API_KEY` is set to true | empty | Your API access key 

## Routes

### [POST] /resolve
This one expects an HTTP POST request with an JSON body which contains the list of urls which should be resolved.

#### Example request
[POST] /resolve
```
[
    "https://www.youtube.com/watch?v=UWb5Qc-fBvk",
    "https://soundcloud.com/dgtl-festival/nto-dgtl-festival-2014",
    "https://i_am_an_unsupported_url.com/123432"
]
```

#### Example response
```
[
    {
        "index": 0,
        "url": "https://www.youtube.com/watch?v=UWb5Qc-fBvk",
        "type": "youtube",
        "meta": {
            "id": "UWb5Qc-fBvk",
            "title": "Tomorrowland 2012 | official aftermovie",
            "description": "Tomorrowland 2012 | official aftermovie\\\nMore Madness... <shortened>",
            "createdAt": "2012-09-10T12:59:18.000Z",
            "previewImage": "https://i.ytimg.com/vi/UWb5Qc-fBvk/maxresdefault.jpg",
            "plays": "128460975",
            "likes": "611971",
            "duration": 1201000
        }
    },
    {
        "index": 1,
        "url": "https://soundcloud.com/dgtl-festival/nto-dgtl-festival-2014",
        "type": "soundcloud",
        "meta": {
            "id": 147200744,
            "title": "N'To @ DGTL Festival 2014",
            "description": "Coming up:\\\n14/8 - 15/8:  DGTL festival BARCELONA - on.fb.me/1CR28NE\\\n\\\nAdam Beyer - Agoria - Âme [DJ] - Ben Klock - Boddika - Breach - David August [Live] - Dixon - De Sluwe Vos - DJ Fra - George Fitzgerald - Henrik Schwarz - Job Jobse - John Talabot - Joseph Capriati - Maceo Plex - Marcel Dettmann - Miguel Puente - Paco Osuna - Paul Ritch - Pearson Sound - Ryan Elliot - Shall Ocin - Tom Trago - Undo - Worakls [Live]\\\n\\\nAlfonso - Awwz - Baldo presents BLD - Begun - DB - Diego Gamez - Ginebra - Jade - Kosmos - Pau Roca\\\n\\\nhttp://www.dgtl.es",
            "createdAt": "2014/04/30 10:32:43 +0000",
            "previewImage": "https://i1.sndcdn.com/artworks-000078018415-24mo55-large.jpg",
            "plays": 32468,
            "likes": 1353,
            "duration": 3792446
        }
    },
    {
        "index": 2,
        "url": "https://i_am_an_unsupported_url.com/123432",
        "type": "unknown"
    }
]
```
