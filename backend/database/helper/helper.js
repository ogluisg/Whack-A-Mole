import Users from '../models/UserModel.js';
import * as logger from '../../services/loggerService.js';

export const findUserWithEmail = (email) => new Promise(async(resolve, reject) => {

    try {
        // locate existing user with same email
        let user = await Users.findOne({ email: email.toLowerCase() })

        // return user 
        return resolve(user)      
                  
     } catch (error) {
       logger.log(error)
       return reject(error)         
     }
})

export const findUserWithId = (id, query = '-password') => new Promise(async(resolve, reject) => {

  try {
      // locate existing user with same email
      let user = await Users.findById(id).select(query)

      // return user 
      return resolve(user)      
                
   } catch (error) {
     logger.log(`Error fetching user by id ${error}`)
     return reject(error)         
   }
})

export const getTopXUsers = (limit) => new Promise(async(resolve, reject) => {

    try {

        // locate the limit amout of users with highest scores
        const users = await Users.find({points: { $gt: 0}}).select('-password').sort({points: -1}).limit(limit)

        // return users
        return resolve(users)
    
     } catch (error) {
        logger.log(`Error fetching top ${limit} users ${error}`)
        return reject(error)    
     }
})

export const updateUser = (_id, field, value) => new Promise(async(resolve, reject) => {
   
    try {

      // find and update the user
       const user = await Users.findByIdAndUpdate({ _id }, {[field]: value})

       // end promise
       return resolve(user)
      
    } catch (error) {
      logger.log(`Error updating user with id ${_id}, failed to modify ${field} to ${value}`)
      return reject(error)    
    }
})