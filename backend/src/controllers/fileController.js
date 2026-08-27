const File = require('../models/fileModel');
const cloudinary = require('../Config/cloudinary');
const redisClient = require('../Config/redisClient');

// Upload File
const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'কোনো file পাওয়া যায়নি' });
    }

    // mimetype দেখে resource_type ঠিক করা
    let resourceType = 'raw'; // default (pdf, docx, ইত্যাদি)
    if (req.file.mimetype.startsWith('image/')) {
      resourceType = 'image';
    } else if (req.file.mimetype.startsWith('video/')) {
      resourceType = 'video';
    }

    const newFile = await File.create({
      fileName: req.file.originalname,
      fileUrl: req.file.path,
      cloudinaryId: req.file.filename,
      resourceType: resourceType,  // ✅ এখন সঠিকভাবে সেট হবে
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      isPublic: req.body.isPublic === 'true',
      owner: req.userId
    });

    await redisClient.del(`user:${req.userId}:files`);

    res.status(201).json({
      message: 'File সফলভাবে upload হয়েছে',
      file: newFile
    });

  } catch (error) {
    res.status(500).json({ 
      message: 'Upload ব্যর্থ হয়েছে', 
      error: error.message 
    });
  }
};
// Get all files of logged-in user (Dashboard)
const getMyFiles = async (req, res) => {
  try {
    const cacheKey = `user:${req.userId}:files`;

    console.log(' User ID:', req.userId);
    console.log(' Redis Key:', cacheKey);

    const cachedFiles = await redisClient.get(cacheKey);

    console.log(' Cached Data:', cachedFiles ? 'FOUND' : 'NOT FOUND');

    if (cachedFiles) {
      console.log(' Cache HIT - Redis থেকে data দেওয়া হলো');

      return res.status(200).json({
        files: JSON.parse(cachedFiles),
        source: 'cache'
      });
    }

    console.log(' Cache MISS - MongoDB থেকে data আনা হচ্ছে');

    const files = await File.find({
      owner: req.userId
    }).sort({ createdAt: -1 });

    await redisClient.set(
      cacheKey,
      JSON.stringify(files),
      {
        EX: 60*60 // 1 hour
      }
    );

    console.log(' Redis cache SET successful');

    return res.status(200).json({
      files,
      source: 'database'
    });

  } catch (error) {

    console.error('Get My Files Error:', error);

    return res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

// Get single file (Public/Private check)
const getFileById = async (req, res) => {
  try {
    
    const file = await File.findById(req.params.userId);

    if (!file) {
      return res.status(404).json({ message: 'File পাওয়া যায়নি' });
    }

    // যদি private হয়, শুধু owner দেখতে পারবে
    if (!file.isPublic) {
      if (!req.userId || file.owner.toString() !== req.userId) {
        return res.status(403).json({ message: 'এই file দেখার অনুমতি নেই' });
      }
    }
// 
    res.status(200).json({ file });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Toggle Public/Private
const toggleVisibility = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ message: 'File পাওয়া যায়নি' });
    }

    if (file.owner.toString() !== req.userId) {
      return res.status(403).json({ message: 'শুধুমাত্র owner এটা পরিবর্তন করতে পারবে' });
    }

    file.isPublic = !file.isPublic;
    await file.save();
    await redisClient.del(`user:${req.userId}:files`);
    res.status(200).json({ message: 'File visibility পরিবর্তন হয়েছে', file });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ message: 'File পাওয়া যায়নি' });
    }

    if (file.owner.toString() !== req.userId) {
      return res.status(403).json({ message: 'শুধুমাত্র owner delete করতে পারবে' });
    }

    // ✅ 'auto' এর বদলে file এ save করা resourceType ব্যবহার করো
    await cloudinary.uploader.destroy(file.cloudinaryId, {
      resource_type: file.resourceType || 'image'
    });

    await file.deleteOne();

    //await redisClient.del(`user:${req.userId}:files`);
    await redisClient.del(`user:${req.userId}:files`);
    res.status(200).json({ message: 'File সফলভাবে delete হয়েছে' });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  uploadFile,
  getMyFiles,
  getFileById,
 toggleVisibility,
 deleteFile
};  