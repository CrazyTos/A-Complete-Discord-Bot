function deleteMessage(message) {
    setTimeout(() => {
        message.delete();
    }, process.env.TIMEOUT);
}

module.exports = {
    deleteMessage,
};
