import User, { UserCreationAttributes } from "../models/user.model";
import bcrypt from "bcryptjs";
import { AppError } from "../errors/AppError";

class UserService {
  async register(data: UserCreationAttributes) {
    const exists = await User.findOne({ where: { email: data.email } });
    if (exists) {
      throw new AppError("Email já cadastrado.", 409);
    }

    const hashed = await bcrypt.hash(data.password, 10);

    const user = await User.create({
      ...data,
      password: hashed,
      role: data.role ?? "user",
    });

    return { id: user.id, name: user.name, email: user.email, role: user.role };
  }
}

export default new UserService();
