import ms from "ms";

const options = (time) => {
    return {
        httpOnly: true,
        secure: true,
        maxAge: ms(time)
    }
}

export default options;