import jwt from 'jsonwebtoken';

export const validarToken = (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ msg: "No hay token, acceso denegado" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, admin) => {

    if (err) return res.status(403).json({ msg: "Token Invalido" });

    req.admin = admin;
    next();
  });
};