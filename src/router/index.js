const express = require('express')
const router = express.Router()
// Controller
const common = require('../controllers/common')
const filemanager = require('../controllers/filemanager')
const auth = require('../controllers/auth')
const users = require('../controllers/users')
const roles = require('../controllers/roles')
const donvi = require('../controllers/donvi')
const navigation = require('../controllers/navigation')
const contractCustomer = require('../controllers/contract-customer')
const hddt = require('../controllers/hddt')
const test = require('../controllers/test')
const test2 = require('../controllers/test2')
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
router.route('/filemanager/')
  .get(filemanager.get)
  .post(filemanager.upload, filemanager.post)

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

// roles
router.route('/roles')
  .get(roles.select)
  .post(roles.insert)
  .put(roles.update)
  .patch(roles.lock)
  .delete(roles.delete)
router.route('/roles/route').get(roles.selectRoleRoute)

// donvi
router.route('/donvi')
  .get(donvi.select)
  .post(donvi.insert)
  .put(donvi.update)
  .patch(donvi.lock)
  .delete(donvi.delete)

// navigation
router.route('/navigation/:id?')
  .get(navigation.get)
  .post(navigation.post)
  .put(navigation.put)
  .patch(navigation.patch)

// contract customer
router.route('/contract-customer/:id?')
  .get(contractCustomer.get)
  .post(contractCustomer.post)
  .put(contractCustomer.put)
  .patch(contractCustomer.patch)

// QRCode
router.route('/hddt')
  .get(hddt.getKyHoaDon)
  .post(hddt.getHDDT)
router.route('/hddt/old').post(hddt.getHDDTOld)
router.route('/hddt/dulieu').post(hddt.getHDDTDULIEU)
router.route('/hddt/table').get(hddt.getTableHDDT)

// test
router.route('/test/:id?')
  .get(test.get)
  .post(test.post)
  .put(test.put)
  .patch(test.patch) // update flag
  .delete(test.delete)
router.route('/test2/:id?')
  .get(test2.get)
  .post(test2.post)
  .put(test2.put)
  .patch(test2.patch) // update flag
  .delete(test2.delete)
// router
//   .route('/employees/:id?')
//   .get(employees.get)
//   .post(employees.post)
//   .put(employees.put)
//   .delete(employees.delete)

module.exports = router
