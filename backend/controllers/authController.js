const User = require('../models/User');
const Airline = require('../models/Airline');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const generateToken = (user) => {
  const tokenData = {
    id: user._id, 
    email: user.email, 
    role: user.role
  };
  
  // Add airlineId for airline users
  if (user.role === 'airline' && user.airlineId) {
    tokenData.airlineId = user.airlineId;
  }
  
  return jwt.sign(
    tokenData,
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

exports.register = async (req, res) => {
  try {
    const { fullName, email, password, phone, role } = req.body;

    // تحقق من وجود المستخدم
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ 
        success: false,
        message: 'المستخدم موجود بالفعل' 
      });
    }

    // تشفير كلمة المرور
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // إنشاء مستخدم جديد
    user = new User({
      fullName,
      email,
      password: hashedPassword,
      phone,
      role: role || 'traveler'
    });

    await user.save();

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'تم التسجيل بنجاح',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // تحقق من المستخدم
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'بريد إلكتروني أو كلمة مرور غير صحيحة' 
      });
    }

    // تحقق من كلمة المرور
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false,
        message: 'بريد إلكتروني أو كلمة مرور غير صحيحة' 
      });
    }

    // تحقق من الدور
    if (role && user.role !== role) {
      return res.status(401).json({ 
        success: false,
        message: 'نوع المستخدم غير متطابق' 
      });
    }

    const token = generateToken(user);

    res.json({
      success: true,
      message: 'تم تسجيل الدخول بنجاح',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        airlineId: user.airlineId
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

exports.airlineRegister = async (req, res) => {
  try {
    const { fullName, email, password, phone, airlineName, airlineCode } = req.body;

    // تحقق من وجود المستخدم
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ 
        success: false,
        message: 'المستخدم موجود بالفعل' 
      });
    }

    // تحقق من وجود الشركة
    let airline = await Airline.findOne({ code: airlineCode });
    if (airline) {
      return res.status(400).json({ 
        success: false,
        message: 'الشركة موجودة بالفعل' 
      });
    }

    // إنشاء شركة طيران جديدة
    airline = new Airline({
      name: airlineName,
      code: airlineCode,
      email: email,
      phone: phone,
      isActive: true
    });
    await airline.save();

    // تشفير كلمة المرور
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // إنشاء مستخدم جديد
    user = new User({
      fullName,
      email,
      password: hashedPassword,
      phone,
      role: 'airline',
      airlineId: airline._id
    });
    await user.save();

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'تم تسجيل الشركة بنجاح',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        airlineId: airline._id,
        airline: {
          id: airline._id,
          name: airline.name,
          code: airline.code
        }
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('airlineId');
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'المستخدم غير موجود' 
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { fullName, phone, passportNumber, nationality, dateOfBirth } = req.body;

    let user = await User.findByIdAndUpdate(
      req.user.id,
      {
        fullName,
        phone,
        passportNumber,
        nationality,
        dateOfBirth
      },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'تم تحديث الملف الشخصي بنجاح',
      user
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select('+password');
    
    // تحقق من كلمة المرور القديمة
    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordValid) {
      return res.status(401).json({ 
        success: false,
        message: 'كلمة المرور القديمة غير صحيحة' 
      });
    }

    // تشفير كلمة المرور الجديدة
    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({
      success: true,
      message: 'تم تغيير كلمة المرور بنجاح'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// نسيان كلمة المرور
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // تحقق من وجود المستخدم
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'لا يوجد مستخدم بهذا البريد الإلكتروني'
      });
    }

    // إنشاء رمز إعادة تعيين عشوائي
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // تخزين الرمز وتاريخ انتهائه في قاعدة البيانات (صالح لمدة 30 دقيقة)
    user.resetPasswordToken = hashedResetToken;
    user.resetPasswordExpiry = Date.now() + 30 * 60 * 1000;
    await user.save();

    // بناء رابط إعادة تعيين كلمة المرور
    const resetUrl = `${process.env.RESET_PASSWORD_URL}?token=${resetToken}`;

    // إرسال رسالة البريد الإلكتروني (يمكن استخدام nodemailer في المستقبل)
    console.log(`📧 Password reset link: ${resetUrl}`);

    res.json({
      success: true,
      message: 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني',
      // للاختبار فقط - قم بإزالة هذا في الإنتاج
      resetToken: resetToken,
      resetUrl: resetUrl
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في إرسال رابط إعادة التعيين'
    });
  }
};

// إعادة تعيين كلمة المرور
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;

    // تحقق من تطابق كلمات المرور
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'كلمات المرور غير متطابقة'
      });
    }

    // تحقق من أن كلمة المرور لا تقل عن 8 أحرف
    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل'
      });
    }

    // تجزئة الرمز المراد البحث عنه
    const hashedResetToken = crypto.createHash('sha256').update(token).digest('hex');

    // ابحث عن المستخدم بالرمز المجزأ والتاريخ الصحيح
    const user = await User.findOne({
      resetPasswordToken: hashedResetToken,
      resetPasswordExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'الرمز غير صحيح أو انتهت صلاحيته'
      });
    }

    // تشفير كلمة المرور الجديدة
    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetPasswordToken = null;
    user.resetPasswordExpiry = null;
    await user.save();

    res.json({
      success: true,
      message: 'تم تحديث كلمة المرور بنجاح'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في تحديث كلمة المرور'
    });
  }
};
