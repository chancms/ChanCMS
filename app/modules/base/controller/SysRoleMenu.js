const {
  common: {
    success, fail ,
  },
} = Chan;
import SysRoleMenu from "../service/SysRoleMenu.js";

let SysRoleMenuController = {

  async list(req, res, next) {
    try {
      const id = req.query.id;
      const data = await SysRoleMenu.list({role_id:id});
      res.json(data);
    } catch (err) {
      next(err);
    }
  }

}

export default SysRoleMenuController;
