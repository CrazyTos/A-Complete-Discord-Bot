function deleteMessage(message, time = process.env.TIMEOUT) {
    if (!message) return;

    setTimeout(() => {
        if (message.deleted) return; // Already deleted
        message.delete();
    }, time);
}

module.exports = {
    deleteMessage,
};
