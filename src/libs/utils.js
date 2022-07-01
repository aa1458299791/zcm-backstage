function formatToTime(time){  //formatToTime格式化时间
	var date = new Date(time*1000)  //后台传回来的时间单位为秒，需要转换为毫秒
	
	const year = date.getFullYear()//getFullYear按照本地时间返回指定日期的年份
	const month = (date.getUTCMonth()+1).toString().padStart(2,'0') //getUTCMonth可返回一个表示月份的数字    toString将其它类型的变量转换为字符串的方法
    const day = date.getDate().toString().padStart(2,'0')
	const hour = date.getHours().toString().padStart(2,'0')
	const minute = date.getMinutes().toString().padStart(2,'0')
	const second = date.getSeconds().toString().padStart(2,'0')
	//获取到年月日时分秒
	return `${year}-${month}-${day} ${hour}:${minute}:${second}`
}

function formatToDate(time){  //formatToTime格式化时间
	var date = new Date(time*1000)  //后台传回来的时间单位为秒，需要转换为毫秒
	
	const year = date.getFullYear()//getFullYear按照本地时间返回指定日期的年份
	const month = (date.getUTCMonth()+1).toString().padStart(2,'0') //getUTCMonth可返回一个表示月份的数字    toString将其它类型的变量转换为字符串的方法
    const day = date.getDate().toString().padStart(2,'0')
	//获取到年月日
	return `${year}-${month}-${day}`
}
export default {
	//导出
	formatToTime,
	formatToDate
}