import { reactive } from 'vue';

const state = reactive({
    message: '',
    type: 'info', // 'info', 'success', 'error'
    visible: false,
    timeout: null
});

export function useToast() {
    const show = (message, type = 'info', duration = 3000) => {
        if (state.timeout) clearTimeout(state.timeout);

        state.message = message;
        state.type = type;
        state.visible = true;

        state.timeout = setTimeout(() => {
            state.visible = false;
        }, duration);
    };

    const success = (msg, dur) => show(msg, 'success', dur);
    const error = (msg, dur) => show(msg, 'error', dur);
    const info = (msg, dur) => show(msg, 'info', dur);

    return {
        state,
        show,
        success,
        error,
        info
    };
}
