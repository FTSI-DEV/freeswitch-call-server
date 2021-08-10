export const FS_ESL = {
    CONNECTION: {
        READY: 'esl::ready',
        CLOSED: 'esl::end',
        ERROR: 'error'
    },
    RECEIVED: 'esl::event::*::*'
};

export const ALL_EVENTS = 'all';
export const DTMF_EVENTS = 'DTMF';
export const DTMF = 'esl::Event::DTMF';

export const ESL_SERVER = {
    CONNECTION: {
        READY: 'connection::ready'
    }
};

export const FS_DIALPLAN = {
    Say: 'say',
    Hangup: 'hangup',
    Dial: 'bridge'
}