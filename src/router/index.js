const express = require('express')
const router = express.Router()
// Controller
const common = require('../controllers/common')
const fileManager = require('../controllers/file-manager')
const auth = require('../controllers/auth')
const users = require('../controllers/users')
const nhanvien = require('../controllers/nhanvien')
const roles = require('../controllers/roles')
const types = require('../controllers/types')
const donvi = require('../controllers/donvi')
const diaban = require('../controllers/diaban')
const loainv = require('../controllers/loai-nv')
const billing = require('../controllers/billing')
const categories = require('../controllers/categories')
const news = require('../controllers/news')
const business = require('../controllers/business')
// const contractCustomer = require('../controllers/contract-customer')
// const hddt = require('../controllers/hddt')
// const test = require('../controllers/test')
// const test2 = require('../controllers/test2')
// const employees = require('../controllers/employees.js')

// common
router.route('/common/exist').get(common.exist)
router.route('/common/generation-query').post(common.GenerationSelect)
router.route('/common/generation-model').post(common.GenerationModel)
router.route('/common/get-column').post(common.getColumn)
router.route('/transaction/list').get(common.transactionList)
// router.route('/common/get-user-from-token').get(common.getUserFromToken)
// router.route('/common/cursor').get(common.cursor)
// upload data
router.route('/file-manager')
  .get(fileManager.get)
  // .post(fileManager.upload, fileManager.post)
  .post(fileManager.upload, fileManager.post)

// auth
router.route('/auth/:id?')
  .get(auth.get)
  .post(auth.post)
// .put(auth.put)
// .delete(auth.delete)

// users
router.route('/users')
  .get(users.select)
  .post(users.insert)
  .put(users.update)
  .patch(users.lock)
  .delete(users.delete)
router.route('/users/set-roles').patch(users.setRoles)
router.route('/users/find').get(users.find)
router.route('/users/get-password').get(users.getPassword)
// Nhân viên
router.route('/nhanvien')
  .get(nhanvien.select)

// roles
router.route('/roles')
  .get(roles.select)
  .post(roles.insert)
  .put(roles.update)
  .patch(roles.lock)
  .delete(roles.delete)
router.route('/roles/route').get(roles.selectRoleRoute)

// Types
router.route('/types')
  .get(types.select)
  .post(types.insert)
  .put(types.update)
  .patch(types.lock)
  .delete(types.delete)

// Đơn vị
router.route('/donvi')
  .get(donvi.select)
  .post(donvi.insert)
  .put(donvi.update)
  .patch(donvi.lock)
  .delete(donvi.delete)

// Địa bàn
router.route('/diaban/quan').get(diaban.getQuan)
router.route('/diaban/phuong').get(diaban.getPhuong)
router.route('/diaban/pho').get(diaban.getPho)
router.route('/diaban').post(diaban.update)
// Tạo dữ liệu địa bàn theo kỳ cước
router.route('/diaban/create-pho-nv-kc').post(diaban.createPhoNVKC)
// Update dữ liệu địa bàn
router.route('/diaban/update-donvi').put(diaban.updateDonvi)
router.route('/diaban/update-donvi-nv').put(diaban.updateDonviNV)
router.route('/diaban/update-pho-like').put(diaban.updateDBPhoLike)
router.route('/diaban/update-quan').put(diaban.updateDBQuan)
router.route('/diaban/update-phuong').put(diaban.updateDBPhuong)
router.route('/diaban/update-pho').put(diaban.updateDBPho)

// Loại nhân viên
router.route('/loai-nv').get(loainv.select)
// Cước
router.route('/billing/get-kycuoc').get(billing.getKyCuoc)

// Danh mục
router.route('/categories')
  .get(categories.select)
  .post(categories.insert)
  .put(categories.update)
  .patch(categories.lock)
  .delete(categories.delete)
router.route('/categories/get-key').get(categories.getKey)
// Tin tức
router.route('/news')
  .get(news.select)
  .post(news.insert)
  .put(news.update)
  .patch(news.lock)
  .delete(news.delete)

// Hợp đồng KHDN
router.route('/business')
  .get(business.select)
  .post(business.insert)
  .put(business.update)
  .patch(business.lock)
  .delete(business.delete)

// // contract customer
// router.route('/contract-customer/:id?')
//   .get(contractCustomer.get)
//   .post(contractCustomer.post)
//   .put(contractCustomer.put)
//   .patch(contractCustomer.patch)

// // QRCode
// router.route('/hddt')
//   .get(hddt.getKyHoaDon)
//   .post(hddt.getHDDT)
// router.route('/hddt/old').post(hddt.getHDDTOld)
// router.route('/hddt/dulieu').post(hddt.getHDDTDULIEU)
// router.route('/hddt/table').get(hddt.getTableHDDT)

// // test
// router.route('/test/:id?')
//   .get(test.get)
//   .post(test.post)
//   .put(test.put)
//   .patch(test.patch) // update flag
//   .delete(test.delete)
// router.route('/test2/:id?')
//   .get(test2.get)
//   .post(test2.post)
//   .put(test2.put)
//   .patch(test2.patch) // update flag
//   .delete(test2.delete)
// router
//   .route('/employees/:id?')
//   .get(employees.get)
//   .post(employees.post)
//   .put(employees.put)
//   .delete(employees.delete)

module.exports = router
