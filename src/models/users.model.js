import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        minLength: 1,
        maxLength: 20
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    }
},
    {
        timestamps: true
    }

)

// hashing password before saving
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
});

// to compare passwords 
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}
export const User = mongoose.model("user", userSchema);