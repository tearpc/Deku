let handler = m => m

handler.before = function (m) {
    let user = global.db.data.users[m.sender]
    let role = (user.level <= 3) ? 'Citizen V'
        : ((user.level >= 3) && (user.level <= 6)) ? 'Citizen IV'
            : ((user.level >= 6) && (user.level <= 9)) ? 'Citizen III'
                : ((user.level >= 9) && (user.level <= 12)) ? 'Citizen II'
                    : ((user.level >= 12) && (user.level <= 15)) ? 'Citizen I'
                        : ((user.level >= 15) && (user.level <= 18)) ? 'Noble V'
                            : ((user.level >= 18) && (user.level <= 21)) ? 'Noble IV'
                                : ((user.level >= 21) && (user.level <= 24)) ? 'Noble III'
                                    : ((user.level >= 24) && (user.level <= 27)) ? 'Noble II'
                                        : ((user.level >= 27) && (user.level <= 30)) ? 'Noble I'
                                            : ((user.level >= 30) && (user.level <= 33)) ? 'Mage V'
                                                : ((user.level >= 33) && (user.level <= 36)) ? 'Mage IV'
                                                    : ((user.level >= 36) && (user.level <= 39)) ? 'Mage III'
                                                        : ((user.level >= 39) && (user.level <= 42)) ? 'Mage II'
                                                            : ((user.level >= 42) && (user.level <= 45)) ? 'Mage I'
                                                                : ((user.level >= 45) && (user.level <= 48)) ? 'Magic Knight V'
                                                                    : ((user.level >= 48) && (user.level <= 51)) ? 'Magic Knight IV'
                                                                        : ((user.level >= 51) && (user.level <= 54)) ? 'Magic Knight III'
                                                                            : ((user.level >= 54) && (user.level <= 57)) ? 'Magic Knight II'
                                                                                : ((user.level >= 57) && (user.level <= 60)) ? 'Magic Knight I'
                                                                                    : ((user.level >= 60) && (user.level <= 63)) ? 'Hero V'
                                                                                        : ((user.level >= 63) && (user.level <= 66)) ? 'Hero IV'
                                                                                            : ((user.level >= 66) && (user.level <= 69)) ? 'Hero III'
                                                                                                : ((user.level >= 69) && (user.level <= 71)) ? 'Hero II'
                                                                                                    : ((user.level >= 71) && (user.level <= 74)) ? 'Hero I'
                                                                                                        : ((user.level >= 74) && (user.level <= 77)) ? 'Demon lord V'
                                                                                                            : ((user.level >= 77) && (user.level <= 80)) ? 'Demon lord IV'
                                                                                                                : ((user.level >= 80) && (user.level <= 83)) ? 'Demon lord III'
                                                                                                                    : ((user.level >= 83) && (user.level <= 86)) ? 'Demon lord II'
                                                                                                                        : ((user.level >= 86) && (user.level <= 89)) ? 'Demon lord I'
                                                                                                                            : ((user.level >= 89) && (user.level <= 91)) ? 'God V'
                                                                                                                                : ((user.level >= 91) && (user.level <= 94)) ? 'God IV'
                                                                                                                                    : ((user.level >= 94) && (user.level <= 97)) ? 'God III'
                                                                                                                                        : ((user.level >= 97) && (user.level <= 99)) ? 'God II'
                                                                                                                                            : ((user.level > 100) ? 'God I'
    user.role = role
    return true
}

module.exports = handler
