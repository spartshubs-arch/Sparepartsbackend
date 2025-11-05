const ContactInfo = require('../models/ContactInfo');

exports.getContactInfo = async (req, res) => {
  try {
    // return the single contact doc (create default if missing)
    let doc = await ContactInfo.findOne();
    if (!doc) {
      doc = await ContactInfo.create({});
    }
    res.json({ success: true, data: doc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.saveContactInfo = async (req, res) => {
  try {
    // req.body: title, description, address, phones (JSON string or comma), emails, socials (JSON string), formDescription, mapEmbedUrl
    const body = req.body || {};
    // build update object
    const update = {
      title: body.title,
      description: body.description,
      address: body.address,
      formDescription: body.formDescription,
      mapEmbedUrl: body.mapEmbedUrl,
    };

    // phones & emails can come as comma separated string or JSON array
    if (body.phones) {
      try { update.phones = JSON.parse(body.phones); } catch { update.phones = body.phones.split(',').map(s => s.trim()); }
    }
    if (body.emails) {
      try { update.emails = JSON.parse(body.emails); } catch { update.emails = body.emails.split(',').map(s => s.trim()); }
    }

    // socials expected as JSON string of [{name,icon,link},...]
    if (body.socials) {
      try { update.socials = JSON.parse(body.socials); } catch { update.socials = []; }
    }

    // Images from multer-cloudinary are in req.files
    // fields names: bannerImage, contactInfoBackground
    if (req.files) {
      if (req.files.bannerImage && req.files.bannerImage[0]) {
        update.bannerImage = req.files.bannerImage[0].path;
      }
      if (req.files.contactInfoBackground && req.files.contactInfoBackground[0]) {
        update.contactInfoBackground = req.files.contactInfoBackground[0].path;
      }
    }

    let doc = await ContactInfo.findOne();
    if (doc) {
      doc = await ContactInfo.findByIdAndUpdate(doc._id, { $set: update }, { new: true, upsert: true });
    } else {
      doc = await ContactInfo.create(update);
    }

    res.json({ success: true, data: doc });
  } catch (err) {
    console.error('saveContactInfo err:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
