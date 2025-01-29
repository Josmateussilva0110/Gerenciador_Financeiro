function auth(request, response, next) {
    if(request.session.user != undefined) next()
    else response.redirect("/user/login")
}

module.exports = auth
