var express = require('express');
var router = express.Router();
let userModel = require('../schemas/users');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - password
 *         - email
 *       properties:
 *         _id:
 *           type: string
 *         username:
 *           type: string
 *         password:
 *           type: string
 *         email:
 *           type: string
 *         fullName:
 *           type: string
 *           default: ""
 *         avatarUrl:
 *           type: string
 *           default: "https://i.sstatic.net/l60Hf.png"
 *         status:
 *           type: boolean
 *           default: false
 *         role:
 *           type: string
 *           description: ObjectId ref to Role
 *         loginCount:
 *           type: integer
 *           default: 0
 *         isDeleted:
 *           type: boolean
 *           default: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Lấy danh sách tất cả User
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Danh sách users
 */
router.get('/', async function (req, res, next) {
  try {
    let data = await userModel.find({ isDeleted: false }).populate('role');
    res.send(data);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

/**
 * @swagger
 * /api/v1/users/{id}:
 *   get:
 *     summary: Lấy User theo ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Thông tin user
 *       404:
 *         description: Không tìm thấy user
 */
router.get('/:id', async function (req, res, next) {
  try {
    let id = req.params.id;
    let result = await userModel.findOne({ _id: id, isDeleted: false }).populate('role');
    if (result) {
      res.send(result);
    } else {
      res.status(404).send({ message: "User ID NOT FOUND" });
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

/**
 * @swagger
 * /api/v1/users:
 *   post:
 *     summary: Tạo mới User
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - email
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *               fullName:
 *                 type: string
 *               avatarUrl:
 *                 type: string
 *               role:
 *                 type: string
 *                 description: Role ObjectId
 *     responses:
 *       200:
 *         description: User đã tạo
 *       400:
 *         description: Lỗi dữ liệu
 */
router.post('/', async function (req, res) {
  try {
    let newUser = new userModel(req.body);
    await newUser.save();
    res.send(newUser);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

/**
 * @swagger
 * /api/v1/users/{id}:
 *   put:
 *     summary: Cập nhật User theo ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *               fullName:
 *                 type: string
 *               avatarUrl:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: User đã cập nhật
 *       404:
 *         description: Không tìm thấy user
 */
router.put('/:id', async function (req, res) {
  try {
    let id = req.params.id;
    let result = await userModel.findByIdAndUpdate(id, req.body, { new: true });
    if (result) {
      res.send(result);
    } else {
      res.status(404).send({ message: "User ID NOT FOUND" });
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

/**
 * @swagger
 * /api/v1/users/{id}:
 *   delete:
 *     summary: Xoá mềm User theo ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User đã xoá mềm
 *       404:
 *         description: Không tìm thấy user
 */
router.delete('/:id', async function (req, res) {
  try {
    let id = req.params.id;
    let result = await userModel.findOne({ _id: id, isDeleted: false });
    if (result) {
      result.isDeleted = true;
      await result.save();
      res.send(result);
    } else {
      res.status(404).send({ message: "User ID NOT FOUND" });
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

/**
 * @swagger
 * /api/v1/users/enable:
 *   post:
 *     summary: Kích hoạt tài khoản User (status = true)
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - username
 *             properties:
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *     responses:
 *       200:
 *         description: User đã được kích hoạt
 *       404:
 *         description: Không tìm thấy user với email và username này
 */
router.post('/enable', async function (req, res) {
  try {
    const { email, username } = req.body;
    let result = await userModel.findOne({ email, username, isDeleted: false });
    if (result) {
      result.status = true;
      await result.save();
      res.send(result);
    } else {
      res.status(404).send({ message: "User with this email and username NOT FOUND" });
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

/**
 * @swagger
 * /api/v1/users/disable:
 *   post:
 *     summary: Vô hiệu hoá tài khoản User (status = false)
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - username
 *             properties:
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *     responses:
 *       200:
 *         description: User đã bị vô hiệu hoá
 *       404:
 *         description: Không tìm thấy user với email và username này
 */
router.post('/disable', async function (req, res) {
  try {
    const { email, username } = req.body;
    let result = await userModel.findOne({ email, username, isDeleted: false });
    if (result) {
      result.status = false;
      await result.save();
      res.send(result);
    } else {
      res.status(404).send({ message: "User with this email and username NOT FOUND" });
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

module.exports = router;
