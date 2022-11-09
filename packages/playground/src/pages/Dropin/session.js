import AdyenCheckout from '@adyen/adyen-web';
import '@adyen/adyen-web/dist/es/adyen.css';
import { createSession } from '../../services';
import { amount, shopperLocale, shopperReference, countryCode, returnUrl } from '../../config/commonConfig';

export async function initSession() {
    const session = await createSession({
        amount,
        reference: 'ABC123',
        returnUrl,
        shopperLocale,
        shopperReference,
        shopperEmail: 'guilherme.ribeiro-ctp3@adyen.com',
        countryCode
    });

    const checkout = await AdyenCheckout({
        environment: process.env.__CLIENT_ENV__,
        clientKey: process.env.__CLIENT_KEY__,
        session,

        // Events.
        beforeSubmit: (data, component, actions) => {
            actions.resolve(data);
        },
        onPaymentCompleted: (result, component) => {
            console.info(result, component);
        },
        onError: (error, component) => {
            console.info(error, component);
        },
        onChange: (state, component) => {
            console.log('onChange', state);
        },
        paymentMethodsConfiguration: {
            paywithgoogle: {
                buttonType: 'plain'
            },
            card: {
                useClickToPay: true,

                // configuration: {
                //     // visaSrciDpaId: '8e6e347c-254e-863f-0e6a-196bf2d9df02',
                //     // visaSrcInitiatorId: 'B9SECVKIQX2SOBQ6J9X721dVBBKHhJJl1nxxVbemHGn5oB6S8'
                //     mcDpaId: '6d41d4d6-45b1-42c3-a5d0-a28c0e69d4b1_dpa2',
                //     mcSrcClientId: '6d41d4d6-45b1-42c3-a5d0-a28c0e69d4b1'
                // },

                hasHolderName: true,
                holderNameRequired: true,
                holderName: 'J. Smith',
                positionHolderNameOnTop: true,

                // billingAddress config:
                billingAddressRequired: true,
                billingAddressMode: 'partial'
            }
        }
    });

    const dropin = checkout.create('dropin', { instantPaymentTypes: ['paywithgoogle'] }).mount('#dropin-container');
    return [checkout, dropin];
}
