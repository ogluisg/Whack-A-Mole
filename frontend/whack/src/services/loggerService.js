
const env = process.env.NODE_ENV;

export const log = (text) => {
    if(env === 'development')
        console.log(text)
}