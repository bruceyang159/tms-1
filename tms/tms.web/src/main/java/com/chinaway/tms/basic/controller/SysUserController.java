package com.chinaway.tms.basic.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.chinaway.tms.admin.model.SysMenu;
import com.chinaway.tms.admin.model.SysRole;
import com.chinaway.tms.admin.model.SysUser;
import com.chinaway.tms.admin.service.SysRoleService;
import com.chinaway.tms.admin.service.SysUserService;
import com.chinaway.tms.utils.json.JsonUtil;

@Controller
public class SysUserController {

	private static final Logger LOGGER = LoggerFactory.getLogger(SysUserController.class);
	
	@Autowired
	private SysUserService sysUserService;
	
	@Autowired
	private SysRoleService sysRoleService;
	
	@Autowired  
	private  HttpServletRequest request;

	/**
	 * 添加用户信息<br>
	 * 返回用户的json串
	 * 
	 * @param userInfo
	 * @return
	 */
	@RequestMapping(value = "/ws/addUser")
	@ResponseBody
	// http://localhost/tms/ws/addUser?userInfo=
	public String addUser(@RequestParam("userInfo") String userInfo) {
		LOGGER.info("传入的参数(userInfo):" + userInfo);
		
		SysUser sysUser = JsonUtil.jsonStr2Obj(userInfo, SysUser.class);
		Map<String, String> argsMap = new HashMap<String, String>();
		
		try {
			sysUserService.insert(sysUser);
			argsMap.put("status", "true");
			argsMap.put("msg", "add sysUser success!");
		} catch (Exception e) {
			System.out.println(e.getMessage());
			argsMap.put("status", "false");
			argsMap.put("msg", "add sysUser failed!");
		}
		
		String ret = JsonUtil.obj2JsonStr(argsMap);
		
		LOGGER.info("addUser传出的参数:" + ret);

		return ret;
	}
	
	/**
	 * 添加用户信息<br>
	 * 返回用户的json串
	 * 
	 * @param userInfo
	 * @return
	 */
	@RequestMapping(value = "/ws/login")
	@ResponseBody
	// http://localhost/tms/ws/addUser?userInfo=
	public String login(@RequestParam("username") String username, @RequestParam("password") String password) {
		
		LOGGER.info("username=" + username + "password=" + password);
		
		Map<String, Object> argsMap = new HashMap<String, Object>();
		try {
			argsMap.put("loginname", username);
			argsMap.put("password", password);
			List<SysUser> sysUserList = sysUserService.selectAll4Page(argsMap);
			if (null != sysUserList && sysUserList.size() > 0) {
				argsMap.put("status", "true");
				argsMap.put("msg", "login success!");
				List<SysRole> roleList = sysRoleService.selectAll4Page(argsMap);
				
                System.out.println("roleList=" + roleList.size());
                
				if (null != roleList && roleList.size() > 0) {
					String roleId = String.valueOf(roleList.get(0).getId());
					List<SysMenu> sysMenuList = sysRoleService.queryMenuByRoleId(roleId);

					System.out.println("sysMenuList=" + sysMenuList.size());
					
					request.getSession().setAttribute("role", roleList.get(0));
					request.getSession().setAttribute("sysMenuList", sysMenuList);
				}
			}
		} catch (Exception e) {
			System.out.println(e.getMessage());
			argsMap.put("status", "false");
			argsMap.put("msg", "login failed!");
		}

		String ret = JsonUtil.obj2JsonStr(argsMap);
		
		LOGGER.info("addUser传出的参数:" + ret);

		return ret;
	}

}