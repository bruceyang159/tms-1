//$(function(){
//    //编辑
//    var param = $ips.getUrlParams();
//    if (param.id) {
//        editid = param.id;
//        
//        var isedit = $("#isedit").val();
//        $ips.load("sysUser", "queryOneById", {'id': param.id}, function(data) {
//            if (data) {
//                var data1 = new Array();
//                chooseId = data.deptid;
//                $.each(data, function(i, v) {
//                    if (v != "" && v != null) {
//                        data1[i] = v;
//                    }
//                    if (v == "0000-00-00" || v == "0000-00-00 00-00-00") {
//                        data1[i] = "";
//                    }
//                });
//                $ips.fillFormInput("editfrom", data1);
////                //img handle
////                $('#showdriverimage').attr('src',data1['driverimage']);
////                $('#driverimageattach_tip').css('display','block');
//            }
//			deptlist();
//        });
//    } else {
//        editid = '';
//        deptlist();
//    }
//	
//})

$("#deptid").select2({
	placeholder : '请选择机构',
	minimumInputLength : 1,
	allowClear : true,
	// 数据加载
	query : function(query) {
		$ips.load('sysDept', 'getDeptByName', {
			name : query.term
		}, function(e) {
			var _pre_data = [];
			$.each(e, function(k, v) {
				_pre_data.push({
					id : v.deptid,
					text : v.name
				});
			});
			var data = {
				results : _pre_data
			};
			query.callback(data);
		});
	},
	initSelection : function (e, r) {
	}
}).on('change', function (e) {
	var deptidP = $('#deptid').select2('val');
	if (deptidP == '') {
		$("#roleids").select2({'data' : []});
		$("#roleids").select2('val', '');
		return false;
	}
	$ips.load('sysRole', 'getRoleByDeptid', {deptid : deptidP}, function(res) {
        var data = [];
        $.each(res, function(k, v) {
            data.push({
                id : v.id,
                text : v.name
            });
        });
        $("#roleids").select2({'data' : data});
		$("#roleids").select2('val', '');
    });
});

$("#roleids").select2({
	placeholder : '请选择角色',
	minimumInputLength : 1,
	multiple : false,
	allowClear : true,
	query : function(query) {
		$ips.load('sysRole', 'getRoleByName', {
			name : query.term
		}, function(e) {
			var _pre_data = [];
			$.each(e, function(k, v) {
				_pre_data.push({
					id : v.id,
					text : v.name
				});
			});
			var data = {
				results : _pre_data
			};
			query.callback(data);
		});
	},
	initSelection : function (e, r) {
		
	}
}).on('change', function (e) {
//	$("#roleids").select2({'data' : []});
//	$("#roleids").select2('val', '');
});

var isupdate = updateid = 0;
var parms = $ips.getUrlParams();
if (parms["id"]) {
	var entity = $ips.load("sysUser", "queryOneById", "id=" + parms["id"]);
	if (!entity.id) {
		window.setTimeout("window.location.hash = '#home.html'", 2000);
	}
	if (entity) {
		$ips.fillFormInput('frmInfo', entity);
        if(entity.deptname){
        	$("#deptid").select2('data', {id : entity.deptid, text : entity.deptname}).val(entity.deptid);
        }
		$("#state").select2('data', {id : entity.state, text : getStateName(entity.state)}).val(entity.state);
		$("#roleids").select2('data', {id : entity.roleid, text : entity.rolename}).val(entity.roleid);
//		var roles = $ips.load('sysRole', 'getRoleByDeptid', {deptid : $('#deptid').val()});
//		var initRoles = [];
//		$.each(roles, function(k, v) {
//            initRoles.push({
//                id : v.id,
//                text : v.name
//            });
//        });
//		$("#roleids").select2({data : initRoles});
//		$('#roleids').select2('val', entity.roleids);
		$('input[name=username]').attr("readonly", "readonly");
		$('#userpic').hide();
		var userpicRow = $('#userpic').closest('label');
		userpicRow.empty();
//		$('<a href="">上传</a>').attr({
//			'data-toggle' : "modal",
//			'data-target' : "#myUpload"
//		}).addClass('btn btn-sm btn-link').bind('click', function() {
//			$('#imgFile').val('');
//		}).appendTo(userpicRow);
		$('#password').hide();
		var passwordRow = $('#password').closest('label');
		passwordRow.empty();
		$('<a href="">修改密码</a>').attr({
			'data-toggle' : "modal",
			'data-target' : "#myModal"
		}).addClass('btn btn-sm btn-link').bind('click', function() {
			$('#newPassword').val('');
			$('#newPasswordAgain').val('');
		}).appendTo(passwordRow);
		// 修改标记
		isupdate = 1;
		// 需要更新的Id
		updateid = entity['id'];
	}
} 
//else {
	// $('#userpic').closest('div').hide();
	// $('#userpic').hide();
	// var userpicRow = $('#userpic').closest('label');
	// userpicRow.empty();
	// $('<input href="">上传</a>').bind('click', function() {
	// $('#imgFile').val('');
	// }).appendTo(userpicRow);
//}


$('#saveNewPassword').bind(
		'click',
		function() {
			if ($('#newPassword').val() == ''
					|| $('#newPasswordAgain').val() == '') {
				$ips.error('密码不能为空');
				return false;
			}
			if ($('#newPassword').val() != $('#newPasswordAgain').val()) {
				$ips.error('两次密码输入不一致!');
				return false;
			}
			if ($('#newPassword').val().length < 6
					|| $('#newPassword').val().length > 16) {
				$ips.error('密码长度不得小于6位大于16');
				return false;
			}
			alert(parms["id"]);
			
			$ips.load('sysUser', 'updateUser', {
				id : parms["id"],
				password : $('#newPassword').val()
			}, function(res) {
				if (typeof res.code != 'undefined' && res.code != 0) {
					$ips.error(res.message);
					return false;
				}
				$ips.succeed('密码修改成功');
				$('#myModal .modal-header button').trigger('click');
			})
			return false;
		});
// Load form valisation dependency
loadScript("js/plugin/jquery-form/jquery-form.min.js", runFormValidation);
//loadScript("js/hui/jquery.hui.upload.js", uploadFile);

// 上传头像
//function uploadFile() {
	// 编辑时上传头像
//	$("#imgFile").upload(
//			{
//				module : "sysUser",
//				method : "uploadImage",
//				onSuccess : function(uploadRes) {
//					if (uploadRes.data) {
//						var appendInput = $("<input type='hidden' value='"
//								+ uploadRes.data + "' name='picid' />");
//						$("#frmInfo").append(appendInput);
//					} else {
//						console.log('UPLOAD ERROR');
//					}
//
//				}
//			});

	// 新建上传头像
	// $("#userpic").upload({
	// module: "user",
	// method: "uploadImage",
	// onSuccess: function(upres) {
	// // console.log(upres);
	// // gPicId = upres;
	// }
	// });

	// 编辑时上传头像
//	$('#saveImage').bind('click', function() {
//		if ($('#imgFile').val() == '') {
//			$ips.error('没有选择文件');
//			return false;
//		}
//
//		$("#imgFile").upload("submit");
//		$('#myUpload .modal-header button').trigger('click');
//		return false;
//	});
//}

// Registration validation script
function runFormValidation() {
	var $checkoutForm = $('#frmInfo').validate({
		// Rules for form validation
		rules : {
			username : {
				required : true
			},
			password : {
				required : true
			},
			email : {
				email : true
			},
			realname : {
				required : true
			}
		},
		// Messages for form validation
		messages : {},
		// Do not change code below
		errorPlacement : function(error, element) {
			error.insertAfter(element.parent());
		}
	});

	// 保存
	$("#btnSubmit").click(function() {
		return userSave(false);
	});
	// 保存并新建
	$("#btnSubmitNew").click(function() {
		return userSave(true);
	});
}

//获取状态名称
function getStateName(str) {
    switch (str) {
        case "2" :
            var name = '禁用';
            break;
        case "1" :
            var name = '可用';
            break;
    }
    return name;
}

function userSave(newed) {
	if (!$('#frmInfo').validate().form()) {
		return false;
	}

//	$('#frmInfo').ajaxSubmit({
//		url: $ips.getApiurl() + "?t=json&m=user&f=save",
//		dataType: 'json',
//		success: function(result) {alert(result);
//			if (result) {
//				$ips.succeed("保存成功。");
//				if (newed) {
//					isupdate = updateid = 0;
//					$('#frmInfo')[0].reset();
//				} else
//					window.history.go(-1);
//			} else {
//				$ips.error("保存失败。" + result.message);
//			}
//
//		}});
//
//	return false;


	var pararm = $("#frmInfo").serialize();
    if (isupdate)
        pararm += '&id=' + updateid;
	$ips.load("sysUser", "addUser", pararm, function(result) {
        if (result) {
            $ips.succeed("保存成功。");
            if (newed) {
                isupdate = updateid = 0;
                $('#frmInfo')[0].reset();
            } else
                window.history.go(-1);
        } else {
            $ips.error("保存失败。" + result);
        }
    }, function(result) {
        // 验证失败的code号码
        if (result.code == 555) {
            var errors = {};
            $.each(eval('(' + result.message + ')'), function($k, $v) {
                if ($('input#' + $k).size() > 0)
                    errors[$k] = $v;
                else
                    $ips.error($k + '：' + $v);
            });
            // 显示后端验证失败信息
            validator.showErrors(errors);
        } else if (result.code == 2) {
            $ips.showError(result.code, [result.message]);
        } else
            $ips.showError(result.code, result.message);
    });
    return false;
}
