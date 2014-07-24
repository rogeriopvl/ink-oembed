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

            if (providers[provider].regex.test(url)) {
                return providers[provider].endpoint;
            }
        }

        return fallbackUrl;
    };

    /**
     * @constructor
     *
     * Example opts object:
     *     {
     *         fallbackUrl: 'http://my.fallback.url/oembed', // optional
     *         endpoint: 'http://my.endpoint.url/oembed', // optional
     *         callback: function(jason){ console.log(jason); } // optional
     *     }
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
    // we could make this more robust by actually checking the format 
    // of the data being passed in, but for now make it a simple structural check
    var isProviderConfig = function(o){ 
        return o && typeof o === 'object' && 
            typeof o.name === 'string' && 
            toString.call(o.regex) === '[object RegExp]' && 
            typeof o.endpoint === 'string';
    }

    /**
     * OEmbed.addProvider
     *
     * add a provider to OEmbed's list of providers
     *
     * Example providerConfig object:
     *     {
     *         name: 'myProviderName',
     *         regex: /the regex that identifies this provider/,
     *         endpoint: 'http://my.provider.url/oembed'
     *     }
     * 
     * @param {Object} providerConfig The configuration object for the new provider
     */
    OEmbed.addProvider = function(providerConfig){
        if (!isProviderConfig(providerConfig)) { 
            Ink.error('Ink.OEmbed: addProvider expects a valid providerConfig object as it\'s argument.');

            return; 
        }

        providers[providerConfig.name] = {
            regex: providerConfig.regex,
            endpoint: providerConfig.endpoint
        }
    };

    /**
     * OEmbed.addProviders
     *
     * add various providers to OEmbed's list of providers
     * 
     * Example providerConfig object:
     *     {
     *         name: 'myProviderName',
     *         regex: /the regex that identifies this provider/,
     *         endpoint: 'http://my.provider.url/oembed'
     *     }
     * 
     * @param {Array} providerConfigArray The configuration objects for each new provider
     */
    OEmbed.addProviders = function(providerConfigArray){
        if(!toString.call(providerConfigArray) === '[object Array]'){ 
            Ink.error('Ink.OEmbed: addProviders expects an array of providerConfigs as it\'s argument.');

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
                    default: case 'link': case 'error': break; // TODO: error is embedly specific, link is oembed standard
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
