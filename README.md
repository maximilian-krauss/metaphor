# metaphor

metaphor is a web service for aggregating and normalizing meta data of media content like youtube videos or soundcloud songs.

Supported platforms:
* Youtube
* Soundcloud
* Spotify (playlists)
* vimeo

## Demo
You can try metaphor here: https://metaphor-dev.herokuapp.com/ or see it in action here: https://krauss.io/music

## Configuration
Environment variable | Required | Default | Description
--- | --- | --- | ---
META_RESOLVER_SOUNDCLOUD_CLIENT_ID | yes | empty | Your Soundcloud Client Id.
META_RESOLVER_YOUTUBE_API_KEY | yes | empty | Your Youtube v3 API Key
META_RESOLVER_SPOTIFY_CLIENT_ID | yes | empty | Your Spotify client ID
META_RESOLVER_SPOTIFY_CLIENT_SECRET | yes | empty | Your Spotify client secret
META_RESOLVER_VIMEO_ACCESS_TOKEN | yes | empty | Your vimeo access token
META_REQUIRE_API_KEY | no | false | Set to true if the resolve route should be accessible via an API Key
META_API_KEY | yes, if `META_REQUIRE_API_KEY` is set to true | empty | Your API access key

### Development
While hacking on metaphor you can place a .env file inside the apps root directory with all required variables.

## Routes

### [POST] /resolve
This one expects an HTTP POST request with an JSON body which contains the list of urls which should be resolved.

#### Example request
[POST] /resolve
```
[
    "https://www.youtube.com/watch?v=UWb5Qc-fBvk",
    "https://soundcloud.com/dgtl-festival/nto-dgtl-festival-2014",
    "https://open.spotify.com/user/paulkalkbrenner_official/playlist/2TyABcP0JuCllhQlMekLBP",
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
            "description": "Tomorrowland 2012 | official aftermovie\nMore Madness... http://bit.ly/IMrCUy <shortened>",
            "createdAt": "2012-09-10T12:59:18.000Z",
            "previewImage": "https://i.ytimg.com/vi/UWb5Qc-fBvk/maxresdefault.jpg",
            "plays": "128536612",
            "likes": "612200",
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
            "description": "Coming up:\n14/8 - 15/8:  DGTL festival BARCELONA - on.fb.me/1CR28NE <shortened>",
            "createdAt": "2014/04/30 10:32:43 +0000",
            "previewImage": "https://i1.sndcdn.com/artworks-000078018415-24mo55-large.jpg",
            "plays": 32593,
            "likes": 1358,
            "duration": 3792446
        }
    },
    {
        "index": 2,
        "url": "https://open.spotify.com/user/paulkalkbrenner_official/playlist/2TyABcP0JuCllhQlMekLBP",
        "type": "spotify",
        "meta": {
            "id": "2TyABcP0JuCllhQlMekLBP",
            "title": "7 and the Best Of Paul Kalkbrenner",
            "description": "This playlist combines new tracks from my upcoming album &quot;7&quot; with a little &quot;Best of&quot; from my greatest Tracks and Productions! <shortened>",
            "createdAt": null,
            "previewImage": "https://u.scdn.co/images/pl/default/55aa835650f3f64a5b0fe87d877383e61dc7a8f2",
            "plays": null,
            "likes": 11858,
            "duration": 10169467
        }
    },
    {
        "index": 3,
        "url": "https://i_am_an_unsupported_url.com/123432",
        "type": "unknown"
    }
]
```
