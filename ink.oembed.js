Ink.createExt('OEmbed', 1, ['Ink.Net.Ajax_1', 'Ink.Dom.Element_1'],
              function (Ajax, InkElement) {

    'use strict';

    var console = window.console || { error: function(){} };
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

            if (providers[provider].regex.test(url)) {
                return providers[provider].endpoint;
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
        this.opts.fallbackUrl = typeof this.opts.fallbackUrl === 'string' ? this.opts.fallbackUrl : defaultFallback;
        this.opts.endpoint = this.opts.endpoint || getProvider(this.holderData.url, this.opts.fallbackUrl);

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
        if (!isProviderConfig(providerConfig)) { 
            console.error('Ink.OEmbed: addProvider expects a valid providerConfig object as it\'s argument.');

            return; 
        }

        providers[providerConfig.name] = {
            regex: providerConfig.regex,
            endpoint: providerConfig.endpoint
        }
    };

    OEmbed.addProviders = function(providerConfigArray){
        if(!toString.call(providerConfigArray) === '[object Array]'){ 
            console.error('Ink.OEmbed: addProviders expects an array of providerConfigs as it\'s argument.');

            return;
        }

        for(var i = 0, iLen = providerConfigArray.length; i < iLen; i++){
            OEmbed.addProvider(providerConfigArray[i]);
        }
    };

    OEmbed.prototype = {
        _init: function () {
            var that = this;
            this._fetch(this.opts.endpoint, function (data) {
                switch(data.type){
                    case 'rich': case 'video': that.holder.innerHTML = data.html; break;
                    case 'photo': that.holder.src = data.url; break;
                    default: case 'link': break; // TODO
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
