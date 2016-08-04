package com.chinaway.tms.basic.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.chinaway.tms.basic.model.SysDept;
import com.chinaway.tms.basic.service.SysDeptService;
import com.chinaway.tms.utils.json.JsonUtil;

@Controller
public class SysDeptController {

	@Autowired
	private SysDeptService sysDeptService;

	/**
	 * 添加部门信息<br>
	 * 返回用户的json串
	 * 
	 * @param deptInfo
	 * @return
	 */
	@RequestMapping(value = "/ws/addDept")
	@ResponseBody
	// http://localhost/tms/ws/addDept?userInfo=
	public String addDept(@RequestParam("userInfo") String userInfo) {
		SysDept sysDept = JsonUtil.jsonStr2Obj(userInfo, SysDept.class);
		Map<String, String> argsMap = new HashMap<String, String>();
		try {
			sysDeptService.insert(sysDept);
			argsMap.put("status", "true");
			argsMap.put("msg", "add dept success!");
		} catch (Exception e) {
			System.out.println(e.getMessage());
			argsMap.put("status", "false");
			argsMap.put("msg", "add dept failed!");
		}

		return JsonUtil.obj2JsonStr(argsMap);
	}

}