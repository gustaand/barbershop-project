import Admin from "../models/Admin.js";
import createToken from "../helpers/createJWT.js";
// import bcrypt from 'bcrypt';

export const register = async (req, res) => {
  const { nombre, email, password } = req.body;

  try {

    // TODO: Mirar es mejor hashear el password o no
    // const passwordHash = await bcrypt.hash(password, 10);

    const admin = new Admin({
      nombre,
      email,
      password,
    });

    const adminSaved = await admin.save();
    const token = await createToken({ id: adminSaved._id });

    res.cookie('token', token);
    res.json(adminSaved);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.message);
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ msg: 'No encontrado.' });

    //TODO: Evaluar si es mejor con BCRYPT para comprobar la contraseña o no.
    const checkPassword = admin.password === password;
    if (!checkPassword) return res.status(400).json({ msg: 'Contraseña incorrecta' });

    const token = await createToken({ id: admin._id });

    res.cookie('token', token);
    res.json({
      id: admin._id,
      nombre: admin.nombre,
      email: admin.email,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
      token
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error.message });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie('token', "", {
      expires: new Date(0)
    });
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error.message });
  }
}

export const adminPerfil = async (req, res) => {
  const { admin } = req;
  res.json(admin);
};