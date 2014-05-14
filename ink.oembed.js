Ink.createExt('OEmbed', 1, ['Ink.Net.Ajax_1', 'Ink.Dom.Element_1'],
              function (Ajax, InkElement) {

    'use strict';

    /**
     * Tries to find the right provider based on given URL
     *
     * @param {string} url - the url of the resource to be embedded
     *
     * @return {string} the url of the adequate provider for given URL
     */
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

    /**
     * @constructor
     *
     * @param {object} holder - the DOM element that will contain the embed
     * @param {object} opts - a hash containing oembed configuration options
     */
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
            this._fetch(this.opts.endpoint, function (data) {
                if (data.type === 'rich' || data.type === 'video') {
                    that.holder.innerHTML = data.html;
                } else if (data.type === 'photo') {
                    that.holder.src = data.url;
                } else {
                    // TODO
                }

                if (typeof that.opts.callback === 'function') {
                    that.opts.callback(data);
                }
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
