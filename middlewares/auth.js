function auth(request, response, next) {
    const public_routes = ["/user/login", "/users/create"] // Rotas públicas

    if (public_routes.includes(request.path)) {
        return next()
    }

    if (request.session.user) {
        response.locals.user = request.session.user
        next()
    } else {
        response.render("admin/users/expired_session")
    }
}

module.exports = auth
