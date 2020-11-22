import { sign } from "jsonwebtoken";

import Users from '../../database/models/UserModel.js';
import config from '../../config/config.js';
import * as logger from '../../services/loggerService.js';
 import * as mailService from '../../services/Nodemailer.js';
import { encrypt, decrypt, buildSignupEmail } from '../../util/util.js'
import { findUserWithEmail, findUserWithId, updateUser } from '../../database/helper/helper.js';
import Code from '../../database/models/CodeSchema';

import cryptoRandomString from 'crypto-random-string'

// function to test server
export const test = (req, res) => {
  return res.status(200).send({info: 'Whack Backend',  status:'running' });
}


// function to signup a new user
export const signup = (req, res) => new Promise(async(resolve, reject) => {

    try {

         const baseUrl = req.protocol + "://" + req.get("host");

         // grab required variables
         const { displayName, email, password } = req.body;

         // locate existing user with same email
         let user = await findUserWithEmail(email)
 
         // if email already linked to an account 
         if(user) return res.status(400).send({ info: 'email already taken' });
 
         // encrypt password
         const encryptedPass = encrypt(password);
 
         // create a new user && save to database
         user = await new Users({ displayName, email, password: encryptedPass}).save()
    
         // display action
         logger.log(`[task]: Successfully added user with email: ${email} to the database`);
 
         // send succesful response
         res.status(200).send({info: 'Successful registration', data: user});    
         
         // generate random code
         const secretCode = cryptoRandomString({ length: 6 });

         // create & save a new code for email verification 
         await (new Code({ code: secretCode, email: user.email})).save();
         
         // email body template for signup
         const data = buildSignupEmail(user, secretCode, baseUrl)

         // fire off email to user
         await mailService.sendEmail(data)

         // end promise
         return resolve()

    } catch (error) {
        logger.log(`Error signing up user ${error}`)
        res.status(400).send({info: 'Bad request'});
        return reject(error)
    }
})

export const verifyUser = (req, res) => new Promise(async(resolve, reject) => {
  try {

    // grab required variables
    const { userId, code } = req.params;

    // locate user in db
    const user = await findUserWithId(userId)

    // if user not found
    if(!user) return res.status(400).send({info: 'Bad request', message: "User doesn't exist"});

    // locate code in db
    const found = await Code.findOne({ email: user.email, code: code})

    // if code not found
    if(!found) return res.status(400).send({info: 'Bad request', message: "Code doesn't exist"});

    // update user's verified status to true
    await updateUser(userId, 'verified', true)

    // delete the codes, since user is now verified
    await Code.deleteMany({email: user.email})

    res.status(200).send({info:'Email succesfully verified'});

    return resolve()

  } catch (error) {
    console.log(`Error verifying email ${erorr}`)
    return reject(error)
  }
})

// function login a user
export const login = (req, res) => new Promise(async(resolve, reject) => {

    try {

        // grab required variables
        const { email, password } = req.body;

        // locate existing user with same email
        let user = await findUserWithEmail(email)

        // email not registered to a user
        if(!user) return res.status(400).send({ info:'User not registered' })

        // decrypt the user's saved password
        let decryptedPass = decrypt(user.password)

        // compare given password with saved password 
        if(decryptedPass !== password) return res.status(400).send({ info: 'Invalid login credentials' })

        if(!user.verified) return res.status(409).send({ info: 'Account not verified' })
        
        // passwords match, create json web token
        let token = sign({ _id: user._id}, config.keys.crypto.auth)

        // display action
        logger.log(`[task]: Successfully logged in user with email: ${email}`);

        // send succesful response
        res.status(200).send({ token: token })

        // end promise
        return resolve()
        
      } catch (error) {
        logger.log(`Error logging in user ${error}`)
        res.status(400).send({info: 'Bad request'});
        return reject(error)
      }
})

export const userDetails = (req, res) =>  new Promise(async(resolve, reject) => {

    try {

      // grab required variables
      const { id } = req.params;

     // locate existing user with same email
      let user = await findUserWithId(id)

      // email not registered to a user
      if(!user) return res.status(400).send({ info:'User not registered' })

      // send succesfull response with user details
      res.status(200).send({data: user })

      // end promise
      return resolve()

    } catch (error) {
      logger.log(`Error fetching user details ${error}`)
      res.status(400).send({info: 'Bad request'});
      return reject(error)
    }
})