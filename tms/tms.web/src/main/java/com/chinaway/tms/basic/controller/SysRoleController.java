package com.chinaway.tms.basic.controller;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.chinaway.tms.basic.model.SysRole;
import com.chinaway.tms.basic.service.SysRoleService;
import com.chinaway.tms.utils.json.JsonUtil;

@Controller
public class SysRoleController {
	
	private static final Logger LOGGER = LoggerFactory.getLogger(SysRoleController.class);
	
	@Autowired
	private SysRoleService sysRoleService;

	/**
	 * 添加角色信息<br>
	 * 返回用户的json串
	 * 
	 * @param roleInfo
	 * @return
	 */
	@RequestMapping(value = "/ws/addRole")
	@ResponseBody
	// http://localhost/tms/ws/addRole?roleInfo=
	public String addRole(@RequestParam("roleInfo") String roleInfo) {
		LOGGER.info("传入的参数(roleInfo):" + roleInfo);
		
		SysRole sysRole = JsonUtil.jsonStr2Obj(roleInfo, SysRole.class);
		Map<String, String> argsMap = new HashMap<String, String>();
		try {
			sysRoleService.insert(sysRole);
			argsMap.put("status", "true");
			argsMap.put("msg", "add Role success!");
		} catch (Exception e) {
			System.out.println(e.getMessage());
			argsMap.put("status", "false");
			argsMap.put("msg", "add Role failed!");
		}

		String ret = JsonUtil.obj2JsonStr(argsMap);
		
		LOGGER.info("addUser传出的参数:" + ret);

		return ret;
	}

}