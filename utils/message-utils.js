function deleteMessage(message) {
    if (!message) return;

    setTimeout(() => {
        if (message.deleted) return; // Already deleted
        message.delete();
    }, process.env.TIMEOUT);
}

module.exports = {
    deleteMessage,
};
