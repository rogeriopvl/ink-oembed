# ink-embed

ink-embed is currently a work in progress.

Ink plugin to embed stuf. For now it only supports embedding of videos from Sapo Vídeos.

## Install

Soon...

## Usage

#### Markup

    <div id="container" data-url="http://videos.sapo.pt/vz0UeKVkl92vQ2bDhIYl" data-with="640" data-height="480"></div>

#### Javascript

    Ink.requireModules(['Ink.Ext.Embed_1'], function (Embed) {
        var emb = new Embed(document.getElementById('container'));
    });

