// const express = require('express');
// const router = express.Router();
// const userController = require('../Controllers/UserController');
// const { authUser } = require('../basicAuth')
// const { projects } = require('../models/UserModel')
// const { canViewProject, canDeleteProject, scopedProjects } = require('../permissions/project')


// router.post('/signup', userController.signup);
 
// router.post('/login', userController.login);
 
// router.get('/user/:userId', userController.allowIfLoggedin, userController.getUser);
 
// router.get('/users', userController.allowIfLoggedin, userController.grantAccess('readAny', 'profile'), userController.getUsers);
 
// router.put('/user/:userId', userController.allowIfLoggedin, userController.grantAccess('updateAny', 'profile'), userController.updateUser);
 
// router.delete('/user/:userId', userController.allowIfLoggedin, userController.grantAccess('deleteAny', 'profile'), userController.deleteUser);
 
// router.get('/', authUser, (req, res) => {
//     res.json(scopedProjects(req.user, projects))
//   })
  
//   router.get('/:projectId', setProject, authUser, authGetProject, (req, res) => {
//     res.json(req.project)
//   })
  
//   router.delete('/:projectId', setProject, authUser, authDeleteProject, (req, res) => {
//     res.send('Deleted Project')
//   })
  
//   function setProject(req, res, next) {
//     const projectId = parseInt(req.params.projectId)
//     req.project = projects.find(project => project.id === projectId)
    
//     if (req.project == null) {
//       res.status(404)
//       return res.send('Project not found')
//     }
//     next()
//   }
  
//   function authGetProject(req, res, next) {
//     if (!canViewProject(req.user, req.project)) {
//       res.status(401)
//       return res.send('Not Allowed')
//     }
  
//     next()
//   }
  
//   function authDeleteProject(req, res, next) {
//     if (!canDeleteProject(req.user, req.project)) {
//       res.status(401)
//       return res.send('Not Allowed')
//     }
  
//     next()
//   }
// module.exports = router;