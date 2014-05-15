# ink-oembed

ink-oembed is currently a work in progress.

Ink plugin to embed stuff using the oembed spec.

## Install

    bower install ink-oembed

## Usage

#### Markup

    <div id="container" data-url="http://videos.sapo.pt/vz0UeKVkl92vQ2bDhIYl" data-with="640" data-height="480"></div>

#### Javascript

    Ink.requireModules(['Ink.Ext.OEmbed_1'], function (OEmbed) {
        var emb = new OEmbed(document.getElementById('container'));
    });

And here's a JSBin example for you to play: http://jsbin.com/jakanodo/3/edit

## API

`OEmbed(element, opts)`

* `element` the container element where the resource will be emebeded
* `opts` (hash)
  *  `endpoint` (string) the OEmbed provider endpoint

If no `opts` is passed, ink-oembed will try to match the `data-url` with [Sapo Videos](http://videos.sapo.pt). If it does not match it will use the http://embed.ly service.
