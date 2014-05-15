# ink-oembed

ink-oembed is currently a work in progress.

Ink plugin to embed stuff using the oembed spec.

## Install

    bower install ink-oembed

## Usage

### Simple Example

#### Markup

    <div id="container" data-url="http://videos.sapo.pt/vz0UeKVkl92vQ2bDhIYl" data-with="640" data-height="480"></div>

#### Javascript

    Ink.requireModules(['Ink.Ext.OEmbed_1'], function (OEmbed) {
        new OEmbed(document.getElementById('container'));
    });

### Advanced Examples

You can pass custom OEmbed endpoint to avoid using the embed.ly service. Here's an example using the twitter OEmbed API:

    Ink.requireModules(['Ink.Ext.OEmbed_1'], function (OEmbed) {
        new OEmbed(document.getElementById('container'), {
            endpoint: 'https://api.twitter.com/1/statuses/oembed.json'
        });
    });

And the markup:

    <div id="container" data-url="https://twitter.com/#!/twitter/status/99530515043983360"></div>

You can even pass a callback to get all the data returned by the OEmbed response:

    Ink.requireModules(['Ink.Ext.OEmbed_1'], function (OEmbed) {
        new OEmbed(document.getElementById('container'), {
            callback: function (data) { alert(data); }
        });
    });

And here's a JSBin example for you to play: http://jsbin.com/jakanodo/3/edit

## API

`OEmbed(element, opts)`

* `element` the container element where the resource will be emebeded
* `opts` (hash)
  *  `endpoint` (string) the OEmbed provider endpoint
  *  `callback` (function) a callback to get the OEmbed response data

If no `opts` is passed, ink-oembed will try to match the `data-url` with [Sapo Videos](http://videos.sapo.pt). If it does not match it will use the http://embed.ly service.
