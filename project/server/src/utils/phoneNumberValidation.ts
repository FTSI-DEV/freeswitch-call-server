export const isPhoneNumberValid = (num:string): boolean => {
    const isUSDialingCode = num.startsWith("+1");
    const phoneNumLength = num.slice(2, num.length).match(/\d/g).length;
    return ((phoneNumLength === 10 || phoneNumLength === 11) && isUSDialingCode)
}