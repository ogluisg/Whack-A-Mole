const env = process.env.NODE_ENV || 'development'

export const log = (text) => {
    if(env === 'development')
        console.log(text)
}