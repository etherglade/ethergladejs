API_URL = "https://etherglade.herokuapp.com/v0";

window.etherglade = function(contractID, apiKey) {
    this.contractID = contractID;
    this.apiKey = apiKey;
    this.generateEthergladeXComponent(contractID);
   
}

window.etherglade.prototype._apiReq = function(path, callback, method, params) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function (e) {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                callback(JSON.parse(xhr.responseText)["result"], null);
            } else {
                callback(null, xhr.responseText);
            }
        }
    };
    xhr.open(method, API_URL + path);
    xhr.setRequestHeader("Authorization", "Token " + this.apiKey);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(params);
}

window.etherglade.prototype.currentAccount = function() {
    if (typeof window.web3 !== 'undefined') {
        return window.web3.eth.accounts[0];
    }
    return null;
}

window.etherglade.prototype.accountBalance = function(address, callback) {
    this._apiReq('/eth/balance/' + address, callback, 'GET', null);
}

window.etherglade.prototype.gasPrice = function(callback) {
    this._apiReq('/eth/gas_price', callback, 'GET', null);
}

window.etherglade.prototype.blockNumber = function(callback) {
    this._apiReq('/eth/block_number', callback, 'GET', null);
}

window.etherglade.prototype.call = function(functionName, args, callback) {
    this._apiReq('/contract/' + this.contractID + '/call/' + functionName, callback, 'POST', JSON.stringify(args));
}

window.etherglade.prototype.generateEthergladeXComponent = function(contractID) {
    console.log(contractID);
    window.etherglade.prototype.EthergladeXComponent = xcomponent.create({

        // The html tag used to render my component
    
        tag: 'etherglade',
    
        // The url that will be loaded in the iframe or popup, when someone includes my component on their page
    
        url:  'https://keen-noether-318f35.netlify.com/' + contractID,
    
        // The background overlay
    
        dimensions: {
            width: '350px',
            height: '550px'
        },
    
        containerTemplate({ id, CLASS, CONTEXT, tag, context, actions, outlet, jsxDom }) {
    
            return jsxDom('div', { id, onClick: close, 'class': `${CLASS.XCOMPONENT} ${CLASS.XCOMPONENT}-tag-${tag} ${CLASS.XCOMPONENT}-context-${context}` },
    
                outlet,
    
                jsxDom('style', null,
    
                    `

                   
                        #${id}.${CLASS.XCOMPONENT}-context-${CONTEXT.IFRAME} .${CLASS.OUTLET} {
                            box-shadow: 2px 2px 10px 3px rgba(0, 0, 0, 0.4);
                            
                            transform: translate3d(-50%, -50%, 0);
                            -webkit-transform: translate3d(-50%, -50%, 0);
                            -moz-transform: translate3d(-50%, -50%, 0);
                            -o-transform: translate3d(-50%, -50%, 0);
                            -ms-transform: translate3d(-50%, -50%, 0);
                        }
    
                        #${id}.${CLASS.XCOMPONENT}-context-${CONTEXT.IFRAME} .${CLASS.OUTLET} {
                            height: 550px;
                            width: 350px;
                        }
    
                        #${id}.${CLASS.XCOMPONENT}-context-${CONTEXT.IFRAME} .${CLASS.OUTLET} iframe {
                            height: 100%;
                            width: 100%;
                            
                            transition: opacity .2s ease-in-out;
                        }
    
                        #${ id } > .${ CLASS.OUTLET } > iframe.${ CLASS.COMPONENT_FRAME } {
                            z-index: 200;
                            border-radius: 10px;
                        }
    
                        #${ id } > .${ CLASS.OUTLET } > iframe.${ CLASS.PRERENDER_FRAME } {
                            z-index: 100;
                        }

                        .${CLASS.OUTLET} {
                            overflow: hidden;
                            border-radius: 10px;
                        }
                    `
                )
            );
        },
    });
}

window.etherglade.prototype.initiateComponent = function(selector, args) {
    var component = this.EthergladeXComponent;
    var key = this.apiKey;
    args._ethergladekey = key;
    args.no_close = true;
    component.render(args, selector);
};


