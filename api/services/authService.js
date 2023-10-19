import bcrypt from 'bcrypt';

class AuthService {
  static async createHash(password) {
    const saltRounds = 10;
    const hash = bcrypt.hashSync(password, saltRounds);
    return hash;
  }

  static async authenticate(password, hash) {
    const isValidPassword = await bcrypt.compare(password, hash);

    if (isValidPassword) {
      console.log('Usuário autenticado com sucesso');
      return isValidPassword;
    }

    console.log('Usuário ou senha incorretos.');
    const objErr = {
      status: 401,
      message: 'email/password not valid',
    };
    throw objErr;
  }
}

export default AuthService;
