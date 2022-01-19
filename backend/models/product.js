const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true,'Please enter product name'],
        trim:true,
        maxlength:[50,'Product name cannot exceed 50 characters']
    },
    price: {
        type: Number,
        required: [true,'Please enter product price'],
         maxlength:[5,'Product name cannot exceed 5 characters'],
         default:0.0
        
    },
    description: {
        type: String,
        required: [true,'Please enter product description']
    },
    ratings:{
        type: Number,
        default:0
    },
    Images:[
        {
            public_id:{
                type: String,
                required:true
                
            },
            url:{
                type: String,
                required:true
            },
        }
    ],
    category:{
        type: String,
        required:[true,'Please select category'],
        enum: {
            values: [
                'Electronics',
                'laptops',
                'cameras',
                'Accessories',
                'Headphones',
                'books',

            ],
            message: 'please select correct category for product'
        }
    },
    seller:{
        type: String,
        required: [true,'Please enter product seller']

    },
    stock: {
        type: Number,
        required: [true,'Please enter product stock'],
        maxlength:[5,'Product name stock exceed 5 characters'],
        default:0
    },
    numOfReviews:{
        type: Number,
        default:0
    },
    reviews:[
        {
            name: {
                type: String,
                required:true
            },
            rating: {
                type: Number,
                required:true
            },
            comment: {
                type: String,
                required:true
            }
        }
    ],
    createdAt:{
        type: Date,
        default:Date.now
    }

})

module.exports = mongoose.model('Product',productSchema);