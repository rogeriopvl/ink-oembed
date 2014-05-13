(function (Ink) {
    'use strict';

    Ink.createExt('OEmbed', 1, ['Ink.Net.Ajax_1', 'Ink.Dom.Element_1'],
                  function (Ajax, InkElement) {

        var ENDPOINT = 'http://videos.sapo.pt/oembed';

        var OEmbed = function (holder, opts) {
            this.holder = holder;
            this.holderData = InkElement.data(this.holder);
            this.opts = opts;

            this._init();
        };

        OEmbed.prototype = {
            _init: function () {
                var that = this;
                this._fetch(ENDPOINT, function (data) {
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
