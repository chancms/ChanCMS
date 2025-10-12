const {
    config:{
      EMAIL
    },
    helper: {
       genCode
    },
    common: {
       fail 
    },
  } = Chan;

export default (req, res, next) => {
  if(!req.cookies._c){
    res.json({ ...fail, msg: "验证码已过期！" })
    return;
  }
  const { code } = req.body;
  if(genCode( req.cookies._c,EMAIL.CODE) !== code){
    res.json({ ...fail, msg: "验证码错误！" })
    return;
  }
  next();
};
  
  

