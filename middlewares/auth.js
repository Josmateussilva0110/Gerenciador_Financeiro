function auth(request, response, next) {
    if(request.session.user != undefined) next()
    else response.render("admin/users/expired_session")
}

module.exports = auth
