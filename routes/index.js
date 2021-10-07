exports.index = function(req, res){
  res.locals.username = req.session.username;
  res.locals.password = req.session.password;
  res.render('index');
};
