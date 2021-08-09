function checkUserHasPermissions(permissions, message) {
    if (!permissions.length) return true;

    return message.member.permissions.has(permissions);
}

module.exports = {
    checkUserHasPermissions,
};
