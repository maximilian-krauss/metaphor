# metaphor

metaphor is a web service for aggregating and normalizing meta data of media content like youtube videos or soundcloud songs.

Supported platforms:
* Youtube
* Soundcloud

## Configuration

Environment variable | Required | Default | Description
--- | --- | --- | ---
META_RESOLVER_SOUNDCLOUD_CLIENT_ID | yes | empty | Your Soundcloud Client Id.
META_RESOLVER_YOUTUBE_API_KEY | yes | empty | Your Youtube v3 API Key
META_REQUIRE_API_KEY | no | false | Set to true if the resolve route should be accessible via an API Key
META_API_KEY | yes, if `META_REQUIRE_API_KEY` is set to true | empty | Your API access key 
