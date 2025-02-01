
import encryptionservice from "../helpers/encryptionservice.js";
import { Admin } from "../models/Admin.js";

import sequelize from "./database.js";

const registerAdmin = async (username,password)=>{

try {
// Check if admin already exists
    const existingAdmin = await Admin.findOne({where:{username}});
    
    if (existingAdmin) {
        console.log(`⚠️ Admin ${username} already exists.`);
        return;
    }
    //Hash Password
    const hashedPassword = await encryptionservice.encryptPassword(password,10);
    
    //create Admin
    await Admin.create({username,password:hashedPassword});
    
    console.log(`✅ Admin ${username} has been created.`);
    
} catch (error) {
    console.error('❌ Error creating admin:', error);
}finally{
 await sequelize.close();
}

};
// Command-line arguments (Example: node adminRegister.js adminUser password123)
const username = process.argv[2];
const password = process.argv[3];
if(!username || !password){
    console.error('❌ Please provide an admin username and password.');
    process.exit(1);
}
registerAdmin(username,password);