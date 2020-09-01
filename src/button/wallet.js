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


export function prerenderWallet({ props, components } : {| props : ButtonProps, components : Components |}) {
    const { clientID } = props;
    const { Wallet } = components;
    
    if (!clientID) {
        return;
    }
    
    smartWallet = smartWallet || renderSmartWallet({ clientID, Wallet });
}

export function renderWallet({ props, payment, components, choices } : ButtonDropdownProps) : ZalgoPromise<void> {
    const { clientID } = props;
    const { button } = payment;
    const { Wallet } = components;
    
    if (!clientID) {
        throw new Error(`Can not render wallet without client id`);
    }
    
    if (!Wallet) {
        throw new Error(`Can not render wallet without wallet component`)
    }
    
    smartWallet = smartWallet || renderSmartWallet({ clientID, Wallet });
    
    const verticalOffset = button.getBoundingClientRect().bottom;
    console.log('vertical offset: ', verticalOffset);
    const loadingTimeout = setTimeout(() => enableLoadingSpinner(button), 50);
    
    
    
    // const onFocusFail = () => {
    //     if (menuToggle) {
    //         const blur = () => {
    //             menuToggle.removeEventListener('blur', blur);
    //             if (smartMenu) {
    //                 smartMenu.hide();
    //             }
    //         };
    //
    //         menuToggle.addEventListener('blur', blur);
    //     }
    // };
    
    
    return smartWallet.display({
        clientID,
        verticalOffset
        // onFocusFail
    }).then(() => {
        disableLoadingSpinner(button);
    }).finally(() => {
        clearTimeout(loadingTimeout);
    });
}

export function clearSmartWallet() {
    smartWallet = null;
}

