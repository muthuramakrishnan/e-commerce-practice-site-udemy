//calls createJwtToken() in user model, send token and save in the cookie
const sendToken = (user, statusCode, res) => {

    //create JWT token
    const token = user.getJwtToken();//implemented this method in model for code reusability

    //options for cookie
    const options = {
        expires: new Date(
            Date.now()+process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    }

    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token,
        user
    })

}

module.exports = sendToken;

//http only cannot be accessed by hackers thru front end js code.. more secure
//it informs the browser that this special cookie should only be accessed by server