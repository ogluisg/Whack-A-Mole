
import * as logger from '../../services/loggerService.js';
import { findUserWithId, getTopXUsers, updateUser } from '../../database/helper/helper.js';


// function to signup a new user
export const getTop5 = (req, res) => new Promise(async(resolve, reject) => {

    try {
        // fetch top 5 users (score wise)
        const users = await getTopXUsers(5);
    
        // return users 
        res.send({ data: users })

        // end promise
        return resolve()

      } catch (error) {
        logger.log(error)
        return res.status(400).send({info: 'Bad request', error: error});
      }
})

// function to get a user's highscore
export const getUserTopScore = (req, res) => new Promise(async(resolve, reject) => {

  try {

      // grab required variables
       const { _id } = req.headers.user;

      // fetch top 5 users (score wise)
      const user = await findUserWithId(_id, '-password -email -displayName -_id -__v')
  
      // return users 
      res.send({ data: user })

      // end promise
      return resolve()

    } catch (error) {
      logger.log(error)
      return res.status(400).send({info: 'Bad request', error: error});
    }
})

export const updateScore = (req, res) => new Promise(async(resolve, reject) => {

  try {

    // grab required variables
    const { _id } = req.headers.user, { points } = req.body;

    // attempt to update user
    const user = await updateUser(_id, 'points', points)

    // return error if user not updated
    if(!user) return res.status(400).send({ info: 'Bad request' });

     // return users 
     res.send({ info: `Succesfully updated score for user with id ${_id}` })

     // end promise
     return resolve();

    } catch (error) {
      logger.log(`Error updating score ${error}`)
      return res.status(400).send({info: 'Bad request', error: error});
    }
})