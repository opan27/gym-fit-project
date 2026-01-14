const { getMe, updateMyProfile } = require('../services/me.service');

async function getMeController(req, res) {
  try {
    const userId = req.user.userId || req.user.id; // sesuaikan isi JWT kamu
    const result = await getMe(userId);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(404).json({ message: err.message });
  }
}

async function updateMyProfileController(req, res) {
  try {
    const userId = req.user.userId || req.user.id;
    const payload = req.body;

    const result = await updateMyProfile(userId, payload);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
}

module.exports = {
  getMeController,
  updateMyProfileController,
};
