const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const token = req.headers.authorization || req.cookies.token; 
  
  if (!token) {
    //return res.status(401).json({ message: 'Unauthorized: Please log in' });
    return res.redirect('/users/login');
  }

  try {
    const decoded = jwt.verify(token, 'SECRET_KEY'); 
    req.user = decoded; 
    next(); 
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authenticate;
