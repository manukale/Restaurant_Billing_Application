import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    userName: { type: String },
    password: { type: String },
    organization_id: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization'
    },
    phone_number: { type: String },
    email: { type: String },
    // Banking Information
    bankDetails: {
        bankName: { type: String },
        accountName: { type: String },
        accountNumber: { type: String },
        ifscCode: { type: String },
        upiId: { type: String },
        paymentQR: { type: String } // This could store a URL or path to the QR code image
    },
    // GST Information
    gstDetails: {
        gstNumber: { type: String, trim: true }, // 15-digit GSTIN
        legalName: { type: String, trim: true },
        tradeName: { type: String, trim: true },
        state: { type: String },
        stateCode: { type: String },
        registrationType: {
            type: String,
            enum: ['Regular', 'Composition', 'SEZ', 'Unregistered'],
            default: 'Regular'
        },

    },
    isAdmin: { type: Boolean, default: false },

})

export default mongoose.model('User', userSchema)