/* @flow */

import { ZalgoPromise } from 'zalgo-promise/src';

import type { MenuChoices } from '../types';
import type { Payment } from '../payment-flows';
import { renderSmartWallet } from '../wallet/interface';

import type { ButtonProps, Components } from './props';
import { enableLoadingSpinner, disableLoadingSpinner } from './dom';

type ButtonDropdownProps = {|
    payment : Payment,
    props : ButtonProps,
    components : Components,
    choices : MenuChoices
|};

let smartWallet;


export function prerenderWallet({ props, components, serviceData, orderPromise } : {| props : ButtonProps, components : Components |}) {
    console.log('inside_prerenderWallet_function');
    const { clientID, createOrder } = props;
    const { Wallet } = components;
    
    
    if (!clientID) {
        return;
    }
    
    if (!orderPromise) {
        console.warn('Needed orderPromise to prerender wallet');
        return;
    }
    
    smartWallet = smartWallet || renderSmartWallet({ createOrder, clientID, Wallet, serviceData, orderPromise });
}

// this function is called after button click
export function renderWallet({ props, payment, Wallet, serviceData, orderPromise } : ButtonDropdownProps) : ZalgoPromise<void> {
    console.log('inside_renderWallet_function');
    
    const { clientID, createOrder, onApprove, clientMetadataID } = props;
    const { button, fundingSource, instrumentID } = payment;
    const { buyerAccessToken } = serviceData;
    
    if (!clientID) {
        throw new Error(`Can not render wallet without client id`);
    }
    
    if (!createOrder) {
        throw new Error(`Can not render wallet without createOrder`);
    }
    
    if (!Wallet) {
        throw new Error(`Can not render wallet without wallet component`)
    }
    
    smartWallet = smartWallet || renderSmartWallet({ clientID, createOrder, Wallet, serviceData, orderPromise });
    
    let verticalOffset = button.getBoundingClientRect().bottom;
    console.log('vertical offset: ', verticalOffset);
    
    if (verticalOffset) {
        verticalOffset = verticalOffset.toString();
    }
    
    const loadingTimeout = setTimeout(() => enableLoadingSpinner(button), 50);
    
    return smartWallet.display({
        verticalOffset,
        buyerAccessToken
    }).then(() => {
        disableLoadingSpinner(button);
    }).finally(() => {
        clearTimeout(loadingTimeout);
    });
}

export function clearSmartWallet() {
    smartWallet = null;
}

