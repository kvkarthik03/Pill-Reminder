const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const passwordValidator = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return password.length >= minLength && 
           hasUpperCase && 
           hasLowerCase && 
           hasNumbers && 
           hasSpecialChar;
};

const nameValidator = (name) => {
    // At least 2 characters, letters only (including spaces and dots for initials)
    const nameRegex = /^[A-Za-z][A-Za-z\s.]{1,}$/;
    return nameRegex.test(name) && name.length >= 2 && name.length <= 50;
};

const licenseNumberValidator = (number) => {
    return /^\d{10}$/.test(number);
};

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        validate: {
            validator: nameValidator,
            message: 'Name must be 2-50 characters long and contain only letters, spaces, and dots'
        }
    },
    email: { type: String, required: true, unique: true },
    password: { 
        type: String, 
        required: true,
        validate: {
            validator: function(v) {
                // Only validate on new password or password change
                if (this.isModified('password')) {
                    return passwordValidator(v);
                }
                return true;
            },
            message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        }
    },
    role: { type: String, enum: ['patient', 'doctor'], required: true },
    // Doctor specific fields
    licenseNumber: {
        type: String,
        required: function() { return this.role === 'doctor'; },
        validate: {
            validator: function(v) {
                if (this.role !== 'doctor') return true;
                return licenseNumberValidator(v);
            },
            message: 'License Number must be exactly 10 digits'
        }
    },
    specialty: {
        type: String,
        required: function() { return this.role === 'doctor'; }
    },
    hospital: {
        type: String,
        required: function() { return this.role === 'doctor'; }
    },
    // Patient specific fields
    gender: { 
        type: String,
        enum: ['male', 'female', 'other'],
        required: function() { return this.role === 'patient'; },
        validate: {
            validator: function(v) {
                if (this.role === 'doctor') return true; // Skip validation for doctors
                return ['male', 'female', 'other'].includes(v);
            },
            message: 'Invalid gender value'
        }
    },
    dateOfBirth: { 
        type: Date,
        required: function() { return this.role === 'patient'; }
    },
    contact: String,
    createdAt: { type: Date, default: Date.now }
});

// Add error handling to password hashing
userSchema.pre('save', async function(next) {
    try {
        if (!this.isModified('password')) return next();
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        console.error('Password hashing error:', error);
        next(error);
    }
});

// Add method to validate password
userSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
