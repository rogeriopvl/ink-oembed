Ink.createExt('OEmbed', 1, ['Ink.Net.Ajax_1', 'Ink.Dom.Element_1'],
              function (Ajax, InkElement) {

    'use strict';

    var defaultFallback = 'http://api.embed.ly/v1/api/oembed';
    var providers = {
        sapovideos: { 
            regex: /videos\.sapo\.pt/,
            endpoint: 'http://videos.sapo.pt/oembed' 
        }
    };

    /**
     * Tries to find the right provider based on given URL
     *
     * @param {string} url - the url of the resource to be embedded
     *
     * @return {string} the url of the adequate provider for given URL
     */
    var getProvider = function (url, fallbackUrl) {
        for(var provider in providers){
            if(!providers.hasOwnProperty(provider)){ continue; }

            if (providers.sapovideos.regex.test(url)) {
                return providers.sapovideos.endpoint;
            }
        }

        return fallbackUrl;
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
        this.opts.endpoint = this.opts.endpoint || getProvider(this.holderData.url, defaultFallback);

        this._init();
    };

    var toString = ({}).toString;
    var isProviderConfig = function(o){
        return o && typeof o === 'object' && 
            typeof o.name === 'string' && 
            toString.call(o.regex) === '[object RegExp]' && 
            typeof o.endpoint === 'string';
    }

    OEmbed.addProvider = function(providerConfig){
        if (!isProviderConfig(providerConfig)) { return; }

        providers[providerConfig.name] = {
            regex: providerConfig.regex,
            endpoint: providerConfig.endpoint
        }
    };

    OEmbed.addProviders = function(providerConfigArray){
        if(!toString.call(providerConfigArray) === '[object Array]'){ return; }

        for(var i = 0, iLen = providerConfigArray.length; i < iLen; i++){
            OEmbed.addProvider(providerConfigArray[i]);
        }
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
