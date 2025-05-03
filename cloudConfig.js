const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({    // saying to backend to connect with cloudinary
    cloud_name:process.env.CLOUD_NAME,  
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET
})

 
const storage = new CloudinaryStorage({   //storing files in cloudinary  and giving allowed formats in mentioned folder
    cloudinary: cloudinary,
    params: {
      folder: 'wanderlust_DEV',
      allowedFormats: ["png","jpg","jpeg"], // supports promises as well
    },
  });

  module.exports={
    cloudinary,
    storage
  }
   