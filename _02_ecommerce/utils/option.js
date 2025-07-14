const options = (time) => {
    return {
        httpOnly: true,
        secure: true,
        maxAge: time * 60 * 1000
    }
}

export default options;