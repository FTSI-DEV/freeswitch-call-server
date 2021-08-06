const FS_ESL = {
    CONNECTION: {
        READY: 'esl::ready',
        CLOSED: 'esl::end',
        ERROR: 'error'
    },
    RECEIVED: 'esl::event::*::*'
};

const ALL_EVENTS = 'all';
const DTMF_EVENTS = 'DTMF';
const DTMF = 'esl::Event::DTMF';

const ESL_SERVER = {
    CONNECTION: {
        READY: 'connection::ready'
    }
};