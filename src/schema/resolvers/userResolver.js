import Register from "../../models/registerModel.js";
import { GraphQLError } from "graphql";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

const port = process.env.PORT;

export default {
  Query: {
    allUser: async () => {
      try {
        const user = Register.find();

        return user;
      } catch (error) {
        throw new GraphQLError("User not found..!!", {
          extensions: {
            code: "NOT_Found",
          },
        });
      }
    },
  },

  Mutation: {
    regiseterUser: async (_, { input }) => {
      try {
        const hasPW = await bcrypt.hash(input.password, 12);

        const profile = input.profilePicture;

        const matchProfile = profile.match(/^data:image\/([a-z]+);base64,/);

        if (!matchProfile) {
          throw new GraphQLError("Enter valid profile picture..!!", {
            extensions: {
              code: "NOT_Valid",
            },
          });
        }

        const extensions = matchProfile[1];

        const fileType = profile.substring(
          "data:".length,
          profile.indexOf("/")
        );

        const regex = new RegExp(
          `^data:${fileType}\/${extensions};base64,`,
          "gi"
        );
        const base64Data = profile.replace(regex, "");

        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);

        const newFileName = uniqueSuffix + "." + extensions;

        const uploadPath = path.join(process.cwd(), "/public/uploads/");

        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath);
        }

        fs.writeFileSync(uploadPath + newFileName, base64Data, "base64");

        const newUser = new Register({
          ...input,
          profilePicture: `http://localhost:${port}/uploads/` + newFileName,
          password: hasPW,
        });

        const newRegister = await newUser.save();

        return newRegister;
      } catch (error) {
        return new GraphQLError(error.message, {
          extensions: {
            code: error.extensions.code,
          },
        });
      }
    },
    updateUser: async (id, input) => {
      try {
        const findUser = await Register.findById(id);

        if (!findUser) {
          throw new GraphQLError("user not found..!!", {
            extensions: {
              code: "NOT_FOUND",
            },
          });
        }

        if (input.userName) {
          findUser.userName = input.userName;
        }
        if (input.gender) {
          findUser.gender = input.gender;
        }
        if (input.age) {
          findUser.age = input.age;
        }
        if (input.profilePicture) {
          findUser.profilePicture = input.profilePicture;
        }
        if (input.email) {
          findUser.age = input.email;
        }

        const updateUser = await findUser.save();

        return updateUser;
      } catch (error) {
        return new GraphQLError(error.message, {
          extensions: {
            code: error.extensions.code,
          },
        });
      }
    },

    deleteUser: async () => {
      try {
        const findUser = await Register.findByIdAndDelete(id);

        if (!findUser) {
          throw new GraphQLError("user not found..!!", {
            extensions: {
              code: "NOT_FOUND",
            },
          });
        }
      } catch (error) {
        return new GraphQLError(error.message, {
          extensions: {
            code: error.extensions.code,
          },
        });
      }
    },
  },
};
