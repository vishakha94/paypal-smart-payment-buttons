/* @flow */

import { ZalgoPromise } from 'zalgo-promise/src';
import { memoize } from 'belter/src';

import type { MenuFlowType, MenuFlowProps } from '../types';

type SmartMenuProps = {|
    clientID : string,
    Menu : MenuFlowType,
    onFocus? : () => void,
    onFocusFail? : () => void
|};

type SmartMenu = {|
    display : (MenuFlowProps) => ZalgoPromise<void>,
    hide : () => ZalgoPromise<void>
|};

export function renderSmartWallet({ createOrder, clientID, Wallet, serviceData, orderPromise } : SmartMenuProps) : SmartMenu {
    console.log('inside_renderSmartWallet_function');
    const { wallet } = serviceData;
    
    const { renderTo, updateProps, show, hide } = Wallet({ clientID, createOrder: () => { return orderPromise; }, wallet });
    
    const render = memoize(() => {
        return renderTo(window.xprops.getParent(), '#smart-wallet');
    });
    
    const display = ({ verticalOffset, buyerAccessToken }) => {
        console.log('inside display, buyer access token: ', buyerAccessToken);
        return render().then(() => {
            return updateProps({
                verticalOffset,
                buyerAccessToken
            });
        }).then(() => {
            return show();
        });
    };
    
    // why double hide?
    hide();
    render().then(() => {
    //     console.log('inside render, buyer access token: ', buyerAccessToken);
    //     console.log('inside render, wallet: ', wallet);
    //
    //     // update prop after render, will that make it available after render finishes?
    //     return updateProps({
    //         clientID
    //     });
    // }).then(() => {
        console.log('rendered, now going to hide');
        return hide;
    });
    // render().then(console.log('not hiding'));
    
    return { display, hide };
}

