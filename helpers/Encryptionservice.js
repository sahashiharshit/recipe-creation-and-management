import bcrypt from "bcrypt";
class Encryptionservice {
  encryptPassword = async (password, saltRounds) => {
    try {
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(password, salt);
      return hashedPassword;
    } catch (error) {
      console.error("Error hashing password:", error);
      throw error;
    }
  };
  checkPassword = async (inputpassword, userPassword) => {
    try {
      const passwordStauts = await bcrypt.compare(inputpassword, userPassword);
      return passwordStauts;
    } catch (error) {
      throw error;
    }
  };
}
export default new Encryptionservice();
