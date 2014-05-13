(function (Ink) {
    'use strict';

    Ink.createExt('OEmbed', 1, ['Ink.Net.Ajax_1', 'Ink.Dom.Element_1'],
                  function (Ajax, InkElement) {

        var getProvider = function (url) {
            var providers = {
                embedly: 'http://api.embed.ly/v1/api/oembed',
                sapovideos: 'http://videos.sapo.pt/oembed'
            };

            if (/videos\.sapo\.pt/.test(url)) {
                return providers.sapovideos;
            } else {
                return providers.embedly;
            }
        };

        var OEmbed = function (holder, opts) {
            this.holder = holder;
            this.holderData = InkElement.data(this.holder);
            this.opts = opts || {};
            this.opts.endpoint = this.opts.endpoint || getProvider(this.holderData.url);

            this._init();
        };

        OEmbed.prototype = {
            _init: function () {
                var that = this;
                console.log(this.opts);
                this._fetch(this.opts.endpoint, function (data) {
                    that.holder.innerHTML = data.html;
                });

            },

            _fetch: function (url, cb) {
                return new Ajax(url, {
                    cors: true,
                    method: 'GET',
                    parameters: this.holderData,
                    onSuccess: function (xhr) {
                        cb(xhr.responseJSON);
                    }
                });
            }
        };

        return OEmbed;
    });
})(Ink);
