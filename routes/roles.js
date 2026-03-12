var express = require('express');
var router = express.Router();
let roleModel = require('../schemas/roles');
let userModel = require('../schemas/users');

/**
 * @swagger
 * components:
 *   schemas:
 *     Role:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *           default: ""
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
 * /api/v1/roles:
 *   get:
 *     summary: Lấy danh sách tất cả Role
 *     tags: [Roles]
 *     responses:
 *       200:
 *         description: Danh sách roles
 */
router.get('/', async function (req, res, next) {
    try {
        let data = await roleModel.find({ isDeleted: false });
        res.send(data);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

/**
 * @swagger
 * /api/v1/roles/{id}:
 *   get:
 *     summary: Lấy Role theo ID
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Role ID
 *     responses:
 *       200:
 *         description: Thông tin role
 *       404:
 *         description: Không tìm thấy role
 */
router.get('/:id', async function (req, res, next) {
    try {
        let id = req.params.id;
        let result = await roleModel.findOne({ _id: id, isDeleted: false });
        if (result) {
            res.send(result);
        } else {
            res.status(404).send({ message: "Role ID NOT FOUND" });
        }
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

/**
 * @swagger
 * /api/v1/roles:
 *   post:
 *     summary: Tạo mới Role
 *     tags: [Roles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Role đã tạo
 *       400:
 *         description: Lỗi dữ liệu
 */
router.post('/', async function (req, res) {
    try {
        let newRole = new roleModel({
            name: req.body.name,
            description: req.body.description
        });
        await newRole.save();
        res.send(newRole);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

/**
 * @swagger
 * /api/v1/roles/{id}:
 *   put:
 *     summary: Cập nhật Role theo ID
 *     tags: [Roles]
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
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Role đã cập nhật
 *       404:
 *         description: Không tìm thấy role
 */
router.put('/:id', async function (req, res) {
    try {
        let id = req.params.id;
        let result = await roleModel.findByIdAndUpdate(id, req.body, { new: true });
        if (result) {
            res.send(result);
        } else {
            res.status(404).send({ message: "Role ID NOT FOUND" });
        }
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

/**
 * @swagger
 * /api/v1/roles/{id}:
 *   delete:
 *     summary: Xoá mềm Role theo ID
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Role đã xoá mềm
 *       404:
 *         description: Không tìm thấy role
 */
router.delete('/:id', async function (req, res) {
    try {
        let id = req.params.id;
        let result = await roleModel.findOne({ _id: id, isDeleted: false });
        if (result) {
            result.isDeleted = true;
            await result.save();
            res.send(result);
        } else {
            res.status(404).send({ message: "Role ID NOT FOUND" });
        }
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

/**
 * @swagger
 * /api/v1/roles/{id}/users:
 *   get:
 *     summary: Lấy tất cả User thuộc Role theo ID
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Role ID
 *     responses:
 *       200:
 *         description: Danh sách users thuộc role
 *       400:
 *         description: Lỗi
 */
router.get('/:id/users', async function (req, res, next) {
    try {
        let id = req.params.id;
        let users = await userModel.find({ role: id, isDeleted: false });
        res.send(users);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

module.exports = router;
