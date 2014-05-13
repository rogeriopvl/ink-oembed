# ink-oembed

ink-oembed is currently a work in progress.

Ink plugin to embed stuff using the oembed spec.

## Install

Soon...

## Usage

#### Markup

    <div id="container" data-url="http://videos.sapo.pt/vz0UeKVkl92vQ2bDhIYl" data-with="640" data-height="480"></div>

#### Javascript

    Ink.requireModules(['Ink.Ext.OEmbed_1'], function (OEmbed) {
        var emb = new OEmbed(document.getElementById('container'));
    });

And here's a JSBin example for you to play: http://jsbin.com/jakanodo/1/edit
