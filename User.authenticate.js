function IsAuthenticated(req,res,next){
  if(req.isAuthenticated()){
      next();
  }else{
     res.redirect('/user/login')
  }
}
function IsnotAuthenticated(req,res,next){
  if(!req.isAuthenticated()){
     next()
  }else{
     res.redirect('/')
  }
}
module.exports = { IsAuthenticated, IsnotAuthenticated}