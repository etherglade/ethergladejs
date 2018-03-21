API_URL = "https://etherglade.herokuapp.com/v0";

window.etherglade = function(contractID, apiKey) {
    this.contractID = contractID;
    this.apiKey = apiKey;
    this.generateEthergladeXComponent(contractID);
    var elem = document.createElement('div');
    elem.id = "_ethergladecontainer";
    document.body.appendChild(elem);
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
    
        url: 'https://keen-noether-318f35.netlify.com/' + contractID,
    
        // The background overlay
    
        dimensions: {
            width: '350px',
            height: '550px'
        },
    
        containerTemplate({ id, CLASS, CONTEXT, tag, context, actions, outlet, jsxDom }) {
    
            function close(event) {
                event.preventDefault();
                event.stopPropagation();
                return actions.close();
            }
    
            function focus(event) {
                event.preventDefault();
                event.stopPropagation();
                return actions.focus();
            }
    
            return jsxDom('div', { id, onClick: close, 'class': `${CLASS.XCOMPONENT} ${CLASS.XCOMPONENT}-tag-${tag} ${CLASS.XCOMPONENT}-context-${context} ${CLASS.XCOMPONENT}-focus` },
    
                outlet,
    
                jsxDom('style', null,
    
                    `
                        #${id} {
                            position: fixed;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            background-color: rgba(0, 0, 0, 0.8);
                        }
    
                        #${id}.${CLASS.XCOMPONENT}-context-${CONTEXT.POPUP} {
                            cursor: pointer;
                        }
    
                        #${id}.${CLASS.XCOMPONENT}-context-${CONTEXT.IFRAME} .${CLASS.OUTLET} {
                            box-shadow: 2px 2px 10px 3px rgba(0, 0, 0, 0.4);
                            position: fixed;
                            top: 50%;
                            left: 50%;
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
                            position: absolute;
                            top: 0;
                            left: 0;
                            transition: opacity .2s ease-in-out;
                        }
    
                        #${ id } > .${ CLASS.OUTLET } > iframe.${ CLASS.VISIBLE } {
                            opacity: 1;
                        }
    
                        #${ id } > .${ CLASS.OUTLET } > iframe.${ CLASS.INVISIBLE } {
                            opacity: 0;
                        }
    
                        #${ id } > .${ CLASS.OUTLET } > iframe.${ CLASS.COMPONENT_FRAME } {
                            z-index: 200;
                            border-radius: 10px;
                        }
    
                        #${ id } > .${ CLASS.OUTLET } > iframe.${ CLASS.PRERENDER_FRAME } {
                            z-index: 100;
                        }
    
                        #${id} .${CLASS.XCOMPONENT}-close {
                            position: absolute;
                            right: 16px;
                            top: 16px;
                            width: 16px;
                            height: 16px;
                            opacity: 0.6;
                        }
    
                        #${id} .${CLASS.XCOMPONENT}-close:hover {
                            opacity: 1;
                        }
    
                        #${id} .${CLASS.XCOMPONENT}-close:before,
                        #${id} .${CLASS.XCOMPONENT}-close:after {
                            position: absolute;
                            left: 8px;
                            content: ' ';
                            height: 16px;
                            width: 2px;
                            background-color: white;
                        }
    
                        #${id} .${CLASS.XCOMPONENT}-close:before {
                            transform: rotate(45deg);
                        }
    
                        #${id} .${CLASS.XCOMPONENT}-close:after {
                            transform: rotate(-45deg);
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
    
    document.querySelector(selector).addEventListener('click', function() {
        args._ethergladekey = key;
        component.render(args, "#_ethergladecontainer");
        document.activeElement.blur();
    });
};


