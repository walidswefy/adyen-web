import { h } from 'preact';
import UIElement from '../UIElement';
import CoreProvider from '../../core/Context/CoreProvider';
import collectBrowserInfo from '../../utils/browserInfo';
import AmazonPayComponent from './components/AmazonPayComponent';
import { AmazonPayElementData, AmazonPayElementProps } from './types';
import defaultProps from './defaultProps';
import './AmazonPay.scss';

export class AmazonPayElement extends UIElement<AmazonPayElementProps> {
    public static type = 'amazonpay';
    protected static defaultProps = defaultProps;

    formatProps(props) {
        return {
            ...props,
            environment: props.environment.toUpperCase(),
            locale: props.locale.replace('-', '_'),
            region: props.region.toUpperCase()
        };
    }

    /**
     * Formats the component data output
     */
    formatData(): AmazonPayElementData {
        const { amazonPayToken } = this.props;
        return {
            paymentMethod: {
                type: AmazonPayElement.type,
                ...(amazonPayToken && { amazonPayToken })
            },
            browserInfo: this.browserInfo
        };
    }

    get isValid() {
        return true;
    }

    get browserInfo() {
        return collectBrowserInfo();
    }

    render() {
        if (this.props.amazonPayToken) return this.submit();

        return (
            <CoreProvider i18n={this.props.i18n} loadingContext={this.props.loadingContext}>
                <AmazonPayComponent
                    ref={ref => {
                        this.componentRef = ref;
                    }}
                    {...this.props}
                    payButton={this.payButton}
                />
            </CoreProvider>
        );
    }
}

export default AmazonPayElement;
