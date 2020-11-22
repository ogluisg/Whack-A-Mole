import CryptoJS from 'crypto-js';
import config from '../config/config.js';

export const encrypt = (data) => {
    return CryptoJS.AES.encrypt(data, config.keys.crypto.auth).toString();
}

export const decrypt = (cipher) => {
    var bytes = CryptoJS.AES.decrypt(cipher, config.keys.crypto.auth);
    return bytes.toString(CryptoJS.enc.Utf8);
}

export const buildSignupEmail = (user, secretCode, baseUrl) => {
     return {
        from: `"Whack A Mole Support" <${config.nodeMailer.user}>`, // sender address
        to: `${user.email}`, // list of receivers
        subject: "Whack A Mole Email Verification", // Subject line
        text: `Thank you for registering, please click ${baseUrl}/api/verify/${user._id}/${secretCode} to verify your account. Stay Safe & Happy Gaming!`, // html body
        html: `<p>Thank you for registering, please click <a href='${baseUrl}/api/verify/${user._id}/${secretCode}'><b>here</b></a> to verify your account.<p><br><h2>Stay Safe & Happy Gaming!</h2>`, // html body
       }
}