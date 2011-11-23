// GET Home Page

exports.index = function(req, res){
  if (session.user) {
    console.log('done here');
  }
  else {
    res.render('index', { title: 'Express' })
  }
};