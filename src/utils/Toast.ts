import { toast } from 'react-hot-toast';

export default class Toast {
    private static styles = getComputedStyle(document.body);

    public static errorToast(message: string) {
        return toast(message, {
            style: {
                background: `rgb(${this.styles.getPropertyValue('--color-state-error')})`,
                color: `rgb(${this.styles.getPropertyValue('--color-black')})`
            }
        });
    }

    public static successToast(message: string) {
        return toast(message, {
            style: {
                background: `rgba(${this.styles.getPropertyValue('--color-state-success')})`,
                color: `rgb(${this.styles.getPropertyValue('--color-black')})`
            }
        });
    }
}