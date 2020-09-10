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


export function prerenderWallet({ props, components, serviceData } : {| props : ButtonProps, components : Components |}) {
    console.log('inside_prerenderWallet_function');
    const { clientID, createOrder } = props;
    const { Wallet } = components;
    
    
    if (!clientID) {
        return;
    }
    
    if (!createOrder) {
        console.log('Not prerendering wallet');
        return;
    }
    
    smartWallet = smartWallet || renderSmartWallet({ createOrder, clientID, Wallet, serviceData });
}

export function renderWallet({ props, payment, Wallet, serviceData } : ButtonDropdownProps) : ZalgoPromise<void> {
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
    
    smartWallet = smartWallet || renderSmartWallet({ clientID, createOrder, Wallet, serviceData });
    
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

